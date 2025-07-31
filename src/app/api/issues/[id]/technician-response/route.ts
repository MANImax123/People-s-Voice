import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Use the same model as admin assignment
    const { default: Issue } = await import('@/models/IssueFull');
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ issue });

  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { default: Issue } = await import('@/models/IssueFull');
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    // Handle form data for file uploads
    const formData = await request.formData();
    const description = formData.get('description') as string;
    const evidencePhotos = formData.getAll('evidencePhotos') as File[];

    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Process uploaded photos
    const processedPhotos = [];
    for (const photo of evidencePhotos) {
      if (photo instanceof File) {
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        processedPhotos.push({
          data: buffer.toString('base64'),
          filename: photo.name,
          mimetype: photo.type,
          size: photo.size,
          uploadedAt: new Date()
        });
      }
    }

    // Update the issue with tech response
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      {
        $set: {
          'technicianResponse.description': description,
          'technicianResponse.evidencePhotos': processedPhotos,
          'technicianResponse.completedAt': new Date(),
          'technicianResponse.technicianId': null, // We'll need to get this from auth
          status: 'resolved'
        }
      },
      { new: true }
    );

    if (!updatedIssue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tech response submitted successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error submitting tech response:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}
