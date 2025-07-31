import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import IssueFull from '@/models/IssueFull';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const techId = searchParams.get('techId');
    
    if (!techId) {
      return NextResponse.json(
        { error: 'Tech ID is required' },
        { status: 400 }
      );
    }

    // Find all active issues assigned to this tech (exclude resolved/closed)
    const issues = await IssueFull.find({
      'assignedTo.techId': techId,
      status: { $nin: ['resolved', 'closed'] }
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      issues,
      count: issues.length
    });

  } catch (error) {
    console.error('Error fetching tech tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech tasks' },
      { status: 500 }
    );
  }
}
