import { GoogleGenerativeAI } from '@google/generative-ai';

interface AnalysisResult {
  priority: number;
  priorityReason: string;
  severityFactors: Array<{
    factor: string;
    impact: string;
    score: number;
  }>;
  confidence: number;
}

export class CivicIssueAnalyzer {
  private genAI: GoogleGenerativeAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required for AI analysis');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async analyzeIssue(
    title: string,
    description: string,
    category: string,
    photos: Array<{ data: string; mimetype: string; filename: string }>,
    location: { metropolitanCity: string; area: string; exactAddress: string }
  ): Promise<AnalysisResult> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Prepare the prompt for AI analysis
      const prompt = this.buildAnalysisPrompt(title, description, category, location);
      
      // Prepare content array with text and images
      const content: any[] = [
        { text: prompt }
      ];

      // Add images for analysis (limit to first 3 for performance)
      for (let i = 0; i < Math.min(photos.length, 3); i++) {
        const photo = photos[i];
        content.push({
          inlineData: {
            mimeType: photo.mimetype,
            data: photo.data
          }
        });
      }

      const result = await model.generateContent(content);
      const response = await result.response;
      const analysisText = response.text();

      // Parse the AI response
      return this.parseAnalysisResponse(analysisText);

    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Fallback to rule-based analysis if AI fails
      return this.fallbackAnalysis(title, description, category);
    }
  }

  private buildAnalysisPrompt(
    title: string,
    description: string,
    category: string,
    location: { metropolitanCity: string; area: string; exactAddress: string }
  ): string {
    return `You are an expert civic issue analyst. Analyze the following civic issue and determine its priority level from 1-10 (where 1 is lowest priority and 10 is highest/emergency).

ISSUE DETAILS:
Title: ${title}
Description: ${description}
Category: ${category}
Location: ${location.area}, ${location.metropolitanCity}
Address: ${location.exactAddress}

ANALYSIS CRITERIA:
Consider these factors when determining priority:

SAFETY IMPACT (Weight: 40%)
- Immediate danger to life/limb (9-10)
- Risk of injury (7-8)
- Safety concern but not immediate (4-6)
- No safety risk (1-3)

PUBLIC HEALTH (Weight: 25%)
- Disease/contamination risk (8-10)
- Sanitation issues (5-7)
- Minor health concerns (2-4)
- No health impact (1)

INFRASTRUCTURE IMPACT (Weight: 20%)
- Critical infrastructure failure (8-10)
- Major service disruption (6-7)
- Minor inconvenience (3-5)
- Cosmetic issues (1-2)

ENVIRONMENTAL IMPACT (Weight: 10%)
- Severe environmental damage (8-10)
- Moderate pollution (5-7)
- Minor environmental concern (2-4)
- No environmental impact (1)

URGENCY (Weight: 5%)
- Emergency response needed (9-10)
- Urgent attention required (7-8)
- Can wait days/weeks (4-6)
- Can wait months (1-3)

ANALYZE THE PROVIDED IMAGES and consider:
- Visible damage severity
- Safety hazards present
- Number of people affected
- Environmental conditions
- Infrastructure condition

RESPOND IN THIS EXACT JSON FORMAT:
{
  "priority": [number from 1-10],
  "priorityReason": "[2-3 sentence explanation of why this priority was assigned]",
  "severityFactors": [
    {
      "factor": "[factor name]",
      "impact": "[description of impact]",
      "score": [1-10 score for this factor]
    }
  ],
  "confidence": [0.0-1.0 confidence in this analysis]
}

Provide only the JSON response, no additional text.`;
  }

  private parseAnalysisResponse(analysisText: string): AnalysisResult {
    try {
      // Clean the response text to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);

      // Validate the response structure
      if (!parsed.priority || !parsed.priorityReason || !parsed.severityFactors || parsed.confidence === undefined) {
        throw new Error('Invalid response structure');
      }

      // Ensure priority is within bounds
      const priority = Math.max(1, Math.min(10, Math.round(parsed.priority)));
      
      // Ensure confidence is within bounds
      const confidence = Math.max(0, Math.min(1, parsed.confidence));

      return {
        priority,
        priorityReason: parsed.priorityReason,
        severityFactors: parsed.severityFactors.map((factor: any) => ({
          factor: factor.factor || 'Unknown',
          impact: factor.impact || 'No description',
          score: Math.max(1, Math.min(10, Math.round(factor.score || 5)))
        })),
        confidence
      };

    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI analysis response');
    }
  }

  private fallbackAnalysis(title: string, description: string, category: string): AnalysisResult {
    // Rule-based fallback analysis
    let priority = 5; // Default medium priority
    const severityFactors = [];

    // Category-based priority adjustment
    const categoryPriorities: Record<string, number> = {
      'water-leakage': 7,
      'sewage-overflow': 8,
      'electrical-hazards': 9,
      'street-lights': 4,
      'potholes': 6,
      'garbage-collection': 5,
      'road-maintenance': 6,
      'traffic-signals': 8,
      'public-toilets': 4,
      'park-maintenance': 3,
      'noise-pollution': 3,
      'illegal-construction': 6,
      'other': 5
    };

    priority = categoryPriorities[category] || 5;

    // Keyword-based priority adjustment
    const highPriorityKeywords = ['emergency', 'danger', 'urgent', 'broken', 'flooding', 'blocked', 'overflow'];
    const lowPriorityKeywords = ['cosmetic', 'minor', 'small', 'aesthetic'];

    const text = (title + ' ' + description).toLowerCase();
    
    if (highPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority = Math.min(10, priority + 2);
      severityFactors.push({
        factor: 'Urgent Keywords',
        impact: 'High priority keywords detected in description',
        score: 8
      });
    }

    if (lowPriorityKeywords.some(keyword => text.includes(keyword))) {
      priority = Math.max(1, priority - 2);
      severityFactors.push({
        factor: 'Low Priority Indicators',
        impact: 'Low priority keywords detected in description',
        score: 3
      });
    }

    severityFactors.push({
      factor: 'Category Assessment',
      impact: `${category} typically requires ${priority > 7 ? 'high' : priority > 4 ? 'medium' : 'low'} priority attention`,
      score: priority
    });

    return {
      priority,
      priorityReason: `Priority determined based on category (${category}) and keyword analysis. ${priority > 7 ? 'High priority due to safety/infrastructure concerns.' : priority > 4 ? 'Medium priority requiring timely attention.' : 'Lower priority, can be scheduled for routine maintenance.'}`,
      severityFactors,
      confidence: 0.7
    };
  }
}

export default CivicIssueAnalyzer;
