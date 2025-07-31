import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Issue } = await import('@/models/IssueFull');
    const { default: Tech } = await import('@/models/Tech');
    const { default: Admin } = await import('@/models/Admin');
    
    const body = await request.json();
    const { issueId, techId, adminId, reason } = body;

    if (!issueId || !techId || !adminId) {
      return NextResponse.json(
        { error: 'Issue ID, Tech ID, and Admin ID are required' },
        { status: 400 }
      );
    }

    // Verify admin exists and has permission
    const admin = await Admin.findById(adminId);
    if (!admin || !admin.permissions.assignIssues) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin does not have permission to assign issues' },
        { status: 403 }
      );
    }

    // Verify tech exists and is active
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

    // Check if issue is already assigned
    if (issue.assignedTo.techId && issue.status !== 'reported') {
      return NextResponse.json(
        { error: 'Issue is already assigned to a tech' },
        { status: 400 }
      );
    }

    // Create assignment history entry
    const assignmentHistory = {
      techId: tech._id,
      techName: tech.name,
      assignedBy: {
        adminId: admin._id,
        adminName: admin.name
      },
      assignedAt: new Date(),
      reason: reason || 'Assigned by admin'
    };

    // Update issue with assignment
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        $set: {
          'assignedTo.techId': tech._id,
          'assignedTo.techName': tech.name,
          'assignedTo.techEmail': tech.email,
          'assignedTo.assignedAt': new Date(),
          'assignedTo.assignedBy.adminId': admin._id,
          'assignedTo.assignedBy.adminName': admin.name,
          status: 'acknowledged'
        },
        $push: {
          assignmentHistory: assignmentHistory
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Issue assigned to ${tech.name} successfully`,
      issue: updatedIssue,
      assignment: {
        tech: {
          id: tech._id,
          name: tech.name,
          email: tech.email,
          specialization: tech.specialization
        },
        admin: {
          id: admin._id,
          name: admin.name
        },
        assignedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error assigning issue:', error);
    return NextResponse.json(
      { error: 'Failed to assign issue' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Issue } = await import('@/models/IssueFull');
    const { default: Admin } = await import('@/models/Admin');
    
    const body = await request.json();
    const { issueId, adminId, reason } = body;

    if (!issueId || !adminId) {
      return NextResponse.json(
        { error: 'Issue ID and Admin ID are required' },
        { status: 400 }
      );
    }

    // Verify admin
    const admin = await Admin.findById(adminId);
    if (!admin || !admin.permissions.assignIssues) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Find and update issue
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    // Update assignment history
    if (issue.assignmentHistory.length > 0) {
      const lastAssignment = issue.assignmentHistory[issue.assignmentHistory.length - 1];
      lastAssignment.unassignedAt = new Date();
      lastAssignment.reason = reason || 'Unassigned by admin';
    }

    // Remove assignment
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        $set: {
          'assignedTo.techId': null,
          'assignedTo.techName': null,
          'assignedTo.techEmail': null,
          'assignedTo.assignedAt': null,
          'assignedTo.assignedBy.adminId': null,
          'assignedTo.assignedBy.adminName': null,
          status: 'reported'
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Issue unassigned successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error unassigning issue:', error);
    return NextResponse.json(
      { error: 'Failed to unassign issue' },
      { status: 500 }
    );
  }
}
