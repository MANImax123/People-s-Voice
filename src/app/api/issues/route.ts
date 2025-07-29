import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Import working model after database connection
    const { default: Issue } = await import('@/models/IssueFull');
    
    // Debug logging
    console.log('Issue model:', Issue);
    console.log('Issue.find type:', typeof Issue.find);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const priority = searchParams.get('priority');
    const userEmail = searchParams.get('userEmail'); // Filter by user email
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Build filter object
    const filter: any = {};
    
    // Filter by user email if provided (for user-specific issues)
    if (userEmail) {
      filter['reportedBy.email'] = userEmail;
      console.log('Filtering issues for user:', userEmail);
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (city && city !== 'all') {
      filter['location.metropolitanCity'] = city;
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Fetch issues with filters and pagination
    const [issues, totalCount] = await Promise.all([
      Issue.find(filter)
        .sort({ reportedAt: -1 }) // Most recent first
        .skip(skip)
        .limit(limit)
        .populate('assignedTo', 'name specialization')
        .lean(),
      Issue.countDocuments(filter)
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      issues,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}