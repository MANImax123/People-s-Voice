import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Use the same model as admin assignment
    const { default: Issue } = await import('@/models/IssueFull');
    
    const { id } = params;
    const body = await request.json();
    const { message, submittedBy, isFromReporter } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    if (!message || !submittedBy) {
      return NextResponse.json(
        { error: 'Message and submittedBy are required' },
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

    // Add user reply to the issue
    const newReply = {
      message,
      submittedBy,
      submittedAt: new Date(),
      isFromReporter: isFromReporter || false
    };

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      {
        $push: {
          userReplies: newReply
        }
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Reply added successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error adding user reply:', error);
    return NextResponse.json(
      { error: 'Failed to add user reply' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Use the same model as admin assignment
    const { default: Issue } = await import('@/models/IssueFull');
    
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    const issue = await Issue.findById(id, 'userReplies');
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ replies: issue.userReplies });

  } catch (error) {
    console.error('Error fetching user replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user replies' },
      { status: 500 }
    );
  }
}
