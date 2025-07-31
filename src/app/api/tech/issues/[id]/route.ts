import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import IssueFull from '@/models/IssueFull';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    const issue = await IssueFull.findById(id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    // Handle FormData for file uploads
    console.log('Request content-type:', request.headers.get('content-type'));
    
    const formData = await request.formData();
    
    const description = formData.get('description') as string;
    const techId = formData.get('techId') as string;
    const evidencePhotos = formData.getAll('evidencePhotos') as File[];

    console.log('FormData parsed successfully:', {
      description: description?.substring(0, 50),
      techId,
      evidencePhotosCount: evidencePhotos.length
    });

    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Process evidence photos from File objects to proper structure for MongoDB
    const processedPhotos = [];
    
    for (const file of evidencePhotos) {
      if (file instanceof File && file.size > 0) {
        try {
          // Check file size (limit to 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            console.log(`Skipping large file: ${file.name}, size: ${file.size} bytes (max: ${maxSize})`);
            continue;
          }

          const buffer = await file.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          const mimeType = file.type || 'image/jpeg';
          const dataUrl = `data:${mimeType};base64,${base64}`;
          
          // Check if base64 string is reasonable size (limit to 6MB base64)
          const maxBase64Size = 6 * 1024 * 1024; // 6MB
          if (dataUrl.length > maxBase64Size) {
            console.log(`Skipping file with large base64: ${file.name}, base64 size: ${dataUrl.length}`);
            continue;
          }
          
          // Create photo object matching the MongoDB model structure
          const photoObject = {
            data: dataUrl,
            filename: file.name,
            mimetype: mimeType,
            size: file.size,
            uploadedAt: new Date()
          };
          
          processedPhotos.push(photoObject);
          console.log(`Processed photo: ${file.name}, original size: ${file.size}, base64 size: ${dataUrl.length}`);
        } catch (error) {
          console.error('Error processing photo:', error);
          // Continue with other photos
        }
      }
    }

    console.log(`Total processed photos: ${processedPhotos.length}`);

    // Validate the processed photos structure
    console.log('Processed photos structure:', processedPhotos.map((photo, index) => ({
      index,
      hasData: !!photo.data,
      hasFilename: !!photo.filename,
      hasMimetype: !!photo.mimetype,
      hasSize: !!photo.size,
      dataLength: photo.data ? photo.data.length : 0
    })));

    // Update the issue with tech response
    const updateData = {
      'technicianResponse.description': description,
      'technicianResponse.evidencePhotos': processedPhotos,
      'technicianResponse.completedAt': new Date(),
      'technicianResponse.technicianId': techId || null,
      status: 'completed' // Mark as completed when tech submits response
    };

    console.log('Update data structure:', {
      ...updateData,
      'technicianResponse.evidencePhotos': `Array with ${processedPhotos.length} photos`
    });

    const updatedIssue = await IssueFull.findByIdAndUpdate(
      id,
      { $set: updateData },
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
