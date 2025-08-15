import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Issue } = await import('@/models/IssueFull');
    const { default: Tech } = await import('@/models/Tech');
    
    const url = new URL(request.url);
    const techId = url.searchParams.get('techId');

    // Get all techs
    const allTechs = await Tech.find({}).select('_id name email');
    
    // Get all issues with assignments
    const allIssues = await Issue.find({}).select('_id title assignedTo status');
    
    // Filter assigned issues
    const assignedIssues = allIssues.filter(issue => issue.assignedTo?.techId);
    
    // If techId provided, get specific assignments
    let specificAssignments = [];
    if (techId) {
      specificAssignments = await Issue.find({
        'assignedTo.techId': techId
      }).select('_id title assignedTo status');
    }

    return NextResponse.json({
      debug: {
        requestedTechId: techId,
        totalTechs: allTechs.length,
        totalIssues: allIssues.length,
        totalAssignedIssues: assignedIssues.length,
        specificAssignments: specificAssignments.length
      },
      data: {
        allTechs,
        assignedIssues: assignedIssues.map(issue => ({
          issueId: issue._id,
          title: issue.title,
          assignedToTechId: issue.assignedTo?.techId,
          assignedToTechName: issue.assignedTo?.techName,
          status: issue.status
        })),
        specificAssignments
      }
    });

  } catch (error) {
    console.error('Debug assignment error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error.message },
      { status: 500 }
    );
  }
}
