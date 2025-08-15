import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Issue } = await import('@/models/IssueFull');
    const { default: Tech } = await import('@/models/Tech');
    
    const body = await request.json();
    const { issueId, techId } = body;

    if (!issueId || !techId) {
      return NextResponse.json(
        { error: 'Issue ID and Tech ID are required' },
        { status: 400 }
      );
    }

    // Find the tech
    const tech = await Tech.findById(techId);
    if (!tech) {
      return NextResponse.json(
        { error: 'Tech not found' },
        { status: 404 }
      );
    }

    // Find the issue
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Update issue with assignment (simplified)
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        $set: {
          'assignedTo.techId': tech._id,
          'assignedTo.techName': tech.name,
          'assignedTo.techEmail': tech.email,
          'assignedTo.assignedAt': new Date(),
          status: 'acknowledged'
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Issue assigned to ${tech.name} successfully`,
      assignment: {
        issueId: updatedIssue._id,
        techId: tech._id,
        techName: tech.name,
        status: updatedIssue.status
      }
    });

  } catch (error) {
    console.error('Test assignment error:', error);
    return NextResponse.json(
      { error: 'Assignment failed', details: error.message },
      { status: 500 }
    );
  }
}
