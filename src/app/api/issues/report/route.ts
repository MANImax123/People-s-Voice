import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CivicIssueAnalyzer from '@/lib/ai-analyzer';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Import working model after database connection
    const { default: Issue } = await import('@/models/IssueFull');
    
    const data = await request.json();
    
    // Ensure we have a valid date
    const now = new Date().toISOString();
    
    // Validate required fields (removed priority from required fields)
    const requiredFields = [
      'title', 'description', 'category',
      'metropolitanCity', 'area', 'exactAddress',
      'reporterName', 'reporterEmail', 'reporterPhone', 'photos'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate photos array
    if (!Array.isArray(data.photos) || data.photos.length === 0) {
      return NextResponse.json(
        { message: 'At least one photo is required' },
        { status: 400 }
      );
    }

    // Validate each photo (should already be Base64 from frontend)
    const validatedPhotos = data.photos.map((photo: any, index: number) => {
      if (!photo.data || !photo.filename || !photo.mimetype) {
        throw new Error(`Photo ${index + 1} is missing required data`);
      }
      
      // Validate file size (limit to 5MB when decoded)
      const sizeInBytes = (photo.data.length * 3) / 4; // Approximate Base64 to bytes
      if (sizeInBytes > 5 * 1024 * 1024) {
        throw new Error(`Photo ${index + 1} exceeds 5MB limit`);
      }
      
      return {
        data: photo.data,
        filename: photo.filename,
        mimetype: photo.mimetype,
        size: sizeInBytes,
        uploadedAt: new Date()
      };
    });

    // AI Analysis - Analyze the issue to determine priority
    console.log('Starting AI analysis...');
    const analyzer = new CivicIssueAnalyzer();
    
    const aiAnalysis = await analyzer.analyzeIssue(
      data.title,
      data.description,
      data.category,
      validatedPhotos,
      {
        metropolitanCity: data.metropolitanCity,
        area: data.area,
        exactAddress: data.exactAddress
      }
    );

    console.log('AI Analysis Result:', aiAnalysis);

    // Create new issue with AI-determined priority
    const newIssue = new Issue({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: aiAnalysis.priority,
      aiAnalysis: {
        priorityReason: aiAnalysis.priorityReason,
        severityFactors: aiAnalysis.severityFactors,
        confidence: aiAnalysis.confidence
      },
      location: {
        metropolitanCity: data.metropolitanCity,
        area: data.area,
        exactAddress: data.exactAddress,
        coordinates: {
          type: 'Point',
          coordinates: [
            data.coordinates?.longitude || 0,
            data.coordinates?.latitude || 0
          ]
        }
      },
      photos: validatedPhotos,
      reportedBy: {
        name: data.reporterName,
        email: data.reporterEmail,
        phone: data.reporterPhone
      },
      status: 'reported',
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const savedIssue = await newIssue.save();
    
    return NextResponse.json(
      { 
        message: 'Issue reported successfully',
        issueId: savedIssue._id,
        issueNumber: savedIssue.issueNumber,
        aiAnalysis: {
          priority: aiAnalysis.priority,
          priorityReason: aiAnalysis.priorityReason,
          confidence: aiAnalysis.confidence
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error reporting issue:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
