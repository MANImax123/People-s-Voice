import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Tech } = await import('@/models/Tech');
    
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    const isActive = searchParams.get('isActive');

    // Build filter
    const filter: any = {};
    if (specialization) filter.specialization = specialization;
    if (isActive !== null) filter.isActive = isActive === 'true';

    // Get techs
    const techs = await Tech.find(filter)
      .select('name email phone specialization experience isActive workload createdAt')
      .sort({ name: 1 })
      .lean();

    // Get current assignments count for each tech
    const { default: Issue } = await import('@/models/IssueFull');
    
    const techsWithWorkload = await Promise.all(
      techs.map(async (tech) => {
        const assignedIssues = await Issue.countDocuments({
          'assignedTo.techId': tech._id,
          status: { $in: ['acknowledged', 'in-progress'] }
        });

        return {
          ...tech,
          currentAssignments: assignedIssues,
          availability: assignedIssues < 10 ? 'available' : assignedIssues < 20 ? 'busy' : 'overloaded'
        };
      })
    );

    return NextResponse.json({
      success: true,
      techs: techsWithWorkload,
      total: techsWithWorkload.length
    });

  } catch (error) {
    console.error('Error fetching techs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch techs' },
      { status: 500 }
    );
  }
}
