import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MeetingRequest from '@/models/MeetingRequest';
import User from '@/models/User';
import Admin from '@/models/Admin';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure User and Admin models are registered
    User;
    Admin;
    
    const {
      userId,
      userEmail,
      userName,
      userPhone,
      meetingType,
      priority,
      initialDescription
    } = await request.json();

    // Validate required fields
    if (!userId || !userEmail || !userName || !userPhone || !meetingType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For demo purposes, skip user validation
    // In production, you would verify the user exists:
    // const user = await User.findById(userId);
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'User not found' },
    //     { status: 404 }
    //   );
    // }

    // Check if user has pending requests (limit to prevent spam)
    const existingPendingRequest = await MeetingRequest.findOne({
      userId,
      status: 'pending'
    });

    if (existingPendingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending meeting request. Please wait for admin response.' },
        { status: 400 }
      );
    }

    // Create new meeting request
    const meetingRequest = new MeetingRequest({
      userId,
      userEmail,
      userName,
      userPhone,
      meetingType,
      priority: priority || 'medium',
      meetingDescription: initialDescription || ''
    });

    await meetingRequest.save();

    return NextResponse.json({
      success: true,
      message: 'Meeting request submitted successfully',
      requestId: meetingRequest._id
    });

  } catch (error) {
    console.error('Error creating meeting request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure User and Admin models are registered
    User;
    Admin;
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const isAdmin = searchParams.get('admin') === 'true';

    let filter: any = {};

    if (userId && !isAdmin) {
      filter.userId = userId;
    }

    if (status) {
      filter.status = status;
    }

    const meetingRequests = await MeetingRequest.find(filter)
      .populate({
        path: 'userId',
        model: User,
        select: 'name email phone'
      })
      .populate({
        path: 'adminId', 
        model: Admin,
        select: 'name email'
      })
      .sort({ createdAt: -1 })
      .limit(isAdmin ? 100 : 50);

    return NextResponse.json({
      success: true,
      meetingRequests
    });

  } catch (error) {
    console.error('Error fetching meeting requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
