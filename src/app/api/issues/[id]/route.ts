import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Issue from '@/models/IssueFull';
import Tech from '@/models/Tech';
import mongoose from 'mongoose';
import { sendIssueResolvedEmail } from '@/lib/email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { status, priority, estimatedResolutionTime, adminNotes } = body;
    const { id: issueId } = await params;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['reported', 'acknowledged', 'in-progress', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      
      if (status === 'resolved') {
        updateData.resolvedAt = new Date();
      } else if (status === 'reported') {
        updateData.resolvedAt = null;
      }
    }
    
    if (priority !== undefined) updateData.priority = priority;
    if (estimatedResolutionTime) updateData.estimatedResolutionTime = estimatedResolutionTime;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    // Find and update the issue
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      { $set: updateData },
      { new: true }
    );
    // .populate('assignedTo.techId', 'name email specialization')
    // .populate('technicianResponse.technicianId', 'name email');

    if (!updatedIssue) {
      return NextResponse.json(
        { message: 'Issue not found' },
        { status: 404 }
      );
    }

    // Send notification for resolved issues
    if (status === 'resolved' && updatedIssue.reportedBy?.email) {
      console.log('✅ Issue resolved:', updatedIssue.title);
      console.log('📧 Sending notification to:', updatedIssue.reportedBy.email);
      
      try {
        const emailResult = await sendIssueResolvedEmail(
          updatedIssue.reportedBy.email,
          updatedIssue.title,
          issueId
        );
        
        if (emailResult.success) {
          console.log('✅ Email sent successfully:', emailResult.messageId);
        } else {
          console.error('❌ Failed to send email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error sending email:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    
    // Ensure the Tech model is registered
    if (!mongoose.models.Tech) {
      require('@/models/Tech');
    }
    
    const issueId = (await params).id;
    
    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return NextResponse.json(
        { error: 'Invalid issue ID' },
        { status: 400 }
      );
    }

    const issue = await Issue.findById(issueId);
      // .populate('assignedTo.techId', 'name email specialization')
      // .populate('technicianResponse.technicianId', 'name email');

    if (!issue) {
      return NextResponse.json(
        { message: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      issue
    });

  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
