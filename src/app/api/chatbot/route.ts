import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatbotResponse {
  response: string;
  type: 'text' | 'quick-reply' | 'contact';
  suggestions?: string[];
}

// Initialize Google AI
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await generateChatbotResponse(query.toLowerCase());
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { 
        response: "I'm experiencing technical difficulties. Please contact our support team for immediate assistance at 1800-CIVIC-HELP.",
        type: 'text'
      },
      { status: 500 }
    );
  }
}

async function generateChatbotResponse(query: string): Promise<ChatbotResponse> {
  // Handle specific actions from quick replies first
  if (query.includes('report_issue')) {
    return {
      response: `📝 **How to Report an Issue:**

1. Go to the "Report Issue" page
2. Select the category (Infrastructure, Public Health, etc.)
3. Provide detailed description
4. Add photos if available
5. Submit your report

Your issue will be assigned to the relevant department and you'll receive updates via email and WhatsApp.

**Need immediate help?** Call our emergency line: 📞 1800-CIVIC-HELP`,
      type: 'text'
    };
  }

  if (query.includes('check_applications')) {
    return {
      response: `📋 **Check Your Applications:**

1. Go to your Profile page
2. Click on "My Applications" tab
3. View status of all submitted applications
4. Track progress in real-time

**Application Status Types:**
• 🟡 Pending Review
• 🔵 Under Processing  
• 🟢 Approved
• 🔴 Additional Info Required

Need help with a specific application? Please provide your application ID.`,
      type: 'text'
    };
  }

  if (query.includes('programs')) {
    return {
      response: `🏛️ **Government Programs Available:**

**Popular Programs:**
• Education Scholarships
• Healthcare Subsidies  
• Housing Assistance
• Employment Support
• Senior Citizen Benefits

**How to Apply:**
1. Browse programs in the "Programs" section
2. Check eligibility criteria
3. Submit online application
4. Upload required documents
5. Track application status

**Need help finding the right program?** Tell me your category of interest!`,
      type: 'text'
    };
  }

  if (query.includes('contact')) {
    return {
      response: `📞 **Contact Support:**

**Emergency Issues:** 🚨
Call: 1800-CIVIC-HELP (24/7)

**General Support:** 💬
Email: support@civicplatform.com
Phone: +91-1234567890
Hours: 9 AM - 6 PM (Mon-Fri)

**Technical Issues:** 💻
Email: tech@civicplatform.com
Live Chat: Available now!

**Office Visit:** 🏢
Address: Civic Center, Main Street
City: Your City, State - 123456
Hours: 10 AM - 5 PM (Mon-Fri)`,
      type: 'contact'
    };
  }

  if (query.includes('tech_help')) {
    return {
      response: `💻 **Technical Help:**

**Common Issues & Solutions:**

**Login Problems:**
• Reset password using "Forgot Password"
• Clear browser cache and cookies
• Try a different browser

**Upload Issues:**
• File size should be under 5MB
• Accepted formats: PDF, JPG, PNG
• Check your internet connection

**Payment Problems:**
• Verify card details are correct
• Check if your bank allows online payments
• Try UPI or Net Banking alternatives

**Still having issues?** Contact tech support: tech@civicplatform.com`,
      type: 'text'
    };
  }

  if (query.includes('payment_help')) {
    return {
      response: `💳 **Payment Assistance:**

**Accepted Payment Methods:**
• Credit/Debit Cards (Visa, Mastercard, RuPay)
• UPI (Google Pay, PhonePe, Paytm)
• Net Banking (All major banks)
• Digital Wallets

**Payment Issues:**
• Check card expiry date
• Ensure sufficient balance
• Verify CVV and OTP
• Try different payment method

**Need a refund?** 
Email: payments@civicplatform.com with transaction ID

**Payment Security:** 🔒
All payments are secured with 256-bit SSL encryption`,
      type: 'text'
    };
  }

  // Emergency detection
  if (query.includes('emergency') || query.includes('urgent')) {
    return {
      response: `🚨 **EMERGENCY ASSISTANCE**

**Immediate Help:**
📞 Emergency Helpline: 1800-CIVIC-HELP (24/7)
🚨 Police: 100
🚑 Ambulance: 108
🔥 Fire: 101

**Report Emergency Issues:**
• Infrastructure collapse
• Public health hazards
• Safety concerns
• Utility failures

**For non-emergency issues**, please use the regular reporting system.

**Stay safe and get immediate help when needed!**`,
      type: 'text'
    };
  }

  // Try AI-powered response for complex queries
  if (genAI && !isSimpleQuery(query)) {
    try {
      const aiResponse = await generateAIResponse(query);
      if (aiResponse) {
        return {
          response: aiResponse,
          type: 'text'
        };
      }
    } catch (error) {
      console.error('AI response error:', error);
      // Fall through to rule-based responses
    }
  }

  // Rule-based responses for common queries
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return {
      response: `Hello! 👋 Welcome to the Civic Platform. I'm here to help you with:

• Reporting civic issues
• Government program applications  
• Payment assistance
• Technical support
• General inquiries

What would you like help with today?`,
      type: 'text'
    };
  }

  if (query.includes('help') || query.includes('assist')) {
    return {
      response: `🆘 **I'm here to help!** Here's what I can assist you with:

**🏛️ Government Services:**
• Program applications
• Document verification
• Status tracking

**📝 Civic Issues:**
• Report problems
• Track complaints
• Emergency services

**💻 Technical Support:**
• Login help
• Payment issues
• File uploads

**📞 Contact Information:**
• Support numbers
• Office locations
• Email contacts

Choose a topic or ask me anything specific!`,
      type: 'text'
    };
  }

  // Default response with helpful guidance
  return {
    response: `I understand you're asking about "${query}". While I'm here to help with civic platform services, I might need more specific information.

**I can help you with:**
• 🏛️ Government programs and applications
• 📝 Reporting civic issues  
• 💳 Payment assistance
• 📄 Document uploads
• 📞 Contact information
• 💻 Technical support

Could you please be more specific about what you need help with? Or choose one of the quick options above!

**For immediate assistance:** Call 1800-CIVIC-HELP`,
    type: 'text'
  };
}

// Check if query is simple enough for rule-based response
function isSimpleQuery(query: string): boolean {
  const simplePatterns = [
    'hello', 'hi', 'hey', 'help', 'thanks', 'thank you', 'bye', 'goodbye'
  ];
  return simplePatterns.some(pattern => query.includes(pattern));
}

// Generate AI-powered response using Google Gemini
async function generateAIResponse(query: string): Promise<string | null> {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a helpful AI assistant for a civic engagement platform called "People's Voice". 
    
Platform Features:
- Citizens can report civic issues (infrastructure, public health, safety, etc.)
- Government program applications and tracking
- Payment processing for civic services
- WhatsApp notifications for updates
- Document uploads and verification
- User profiles and application management

Your role:
- Provide helpful, accurate information about the platform
- Guide users through processes step-by-step
- Be friendly, professional, and concise
- Focus on civic services and government-related help
- If you don't know something specific, direct users to contact support

User Question: "${query}"

Provide a helpful response in 2-3 paragraphs max. Use emojis sparingly and professionally. If it's not related to civic services, politely redirect to platform features.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Google AI error:', error);
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Civic Chatbot API is running',
    capabilities: [
      'Issue reporting guidance',
      'Application status tracking', 
      'Government program information',
      'Payment assistance',
      'Technical support',
      'Contact information',
      'Emergency assistance'
    ],
    availableActions: [
      'report_issue',
      'check_applications', 
      'programs',
      'contact',
      'tech_help',
      'payment_help'
    ]
  });
}
