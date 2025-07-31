import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Import the model that's being used for assignments
    const { default: Issue } = await import('@/models/IssueFull');
    
    const url = new URL(request.url);
    const techId = url.searchParams.get('techId');

    if (!techId) {
      return NextResponse.json(
        { error: 'Tech ID is required' },
        { status: 400 }
      );
    }

    // Find all issues assigned to this tech (including completed ones for dashboard view)
    const assignedIssues = await Issue.find({
      'assignedTo.techId': techId
    }).sort({ 'assignedTo.assignedAt': -1 });

    return NextResponse.json({
      success: true,
      issues: assignedIssues,
      count: assignedIssues.length
    });

  } catch (error) {
    console.error('Error fetching tech tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned issues' },
      { status: 500 }
    );
  }
}