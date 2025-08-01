import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';
import User from '@/models/User';
import { sendBulkWhatsAppNotifications } from '@/lib/whatsapp-notifications';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter
    const filter: any = {
      visibility: 'public',
      approvalStatus: 'approved'
    };

    if (status !== 'all') {
      filter.status = status;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [programs, total] = await Promise.all([
      Program.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-comments.likes -likes -dislikes'), // Exclude detailed social data for listing
      Program.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      programs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrograms: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Get programs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      title,
      description,
      category,
      startDate,
      endDate,
      budget,
      targetBeneficiaries,
      eligibilityCriteria,
      applicationProcess,
      contactInfo,
      tags,
      priority,
      adminId,
      adminEmail,
      adminName
    } = await req.json();

    // Validation
    if (!title || !description || !category || !startDate || !adminEmail) {
      return NextResponse.json(
        { error: 'Required fields: title, description, category, startDate, adminEmail' },
        { status: 400 }
      );
    }

    const program = new Program({
      title,
      description,
      category,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      budget,
      targetBeneficiaries,
      eligibilityCriteria,
      applicationProcess,
      contactInfo,
      tags: Array.isArray(tags) ? tags : [],
      priority: priority || 'medium',
      createdBy: {
        adminId: adminId || adminEmail,
        adminEmail,
        adminName: adminName || 'Admin'
      },
      lastUpdatedBy: {
        adminId: adminId || adminEmail,
        adminEmail,
        adminName: adminName || 'Admin'
      }
    });

    await program.save();

    // Send WhatsApp notifications to all users about the new program
    try {
      console.log('📱 Starting WhatsApp notifications for new program:', program.title);
      
      // Fetch all users from the database
      const users = await User.find({ role: 'user' }, { phoneNumber: 1, name: 1 }).lean();
      
      if (users && users.length > 0) {
        console.log(`📱 Found ${users.length} users to notify`);
        
        // Send bulk WhatsApp notifications
        const notificationResult = await sendBulkWhatsAppNotifications(
          users.map(user => ({
            phoneNumber: user.phoneNumber,
            name: user.name
          })),
          program.title,
          program._id.toString(),
          program.category
        );
        
        console.log(`📱 WhatsApp notifications sent: ${notificationResult.success} success, ${notificationResult.failed} failed`);
      } else {
        console.log('📱 No users found to notify');
      }
    } catch (notificationError) {
      // Don't fail the program creation if notifications fail
      console.error('📱 Error sending WhatsApp notifications:', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Program created successfully',
      program: {
        _id: program._id,
        title: program.title,
        description: program.description,
        category: program.category,
        status: program.status,
        createdAt: program.createdAt
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create program error:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
