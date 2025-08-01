import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Program from '@/models/Program';
import { sendBulkWhatsAppNotifications, sendWhatsAppNotification } from '@/lib/whatsapp-notifications';

// POST: Send WhatsApp notifications for a specific program
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { programId, userPhoneNumbers, notificationType = 'new_program' } = await req.json();

    if (!programId) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      );
    }

    // Fetch the program details
    const program = await Program.findById(programId);
    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    let users;
    let notificationResults;

    if (userPhoneNumbers && Array.isArray(userPhoneNumbers) && userPhoneNumbers.length > 0) {
      // Send to specific phone numbers
      console.log(`📱 Sending WhatsApp notifications to ${userPhoneNumbers.length} specific users`);
      
      const userList = userPhoneNumbers.map((phone: string) => ({ phoneNumber: phone }));
      
      notificationResults = await sendBulkWhatsAppNotifications(
        userList,
        program.title,
        program._id.toString(),
        program.category
      );
    } else {
      // Send to all users
      console.log('📱 Sending WhatsApp notifications to all users');
      
      users = await User.find({ role: 'user' }, { phoneNumber: 1, name: 1 }).lean();
      
      if (!users || users.length === 0) {
        return NextResponse.json(
          { error: 'No users found to notify' },
          { status: 404 }
        );
      }

      notificationResults = await sendBulkWhatsAppNotifications(
        users.map(user => ({
          phoneNumber: user.phoneNumber,
          name: user.name
        })),
        program.title,
        program._id.toString(),
        program.category
      );
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp notifications sent',
      program: {
        id: program._id,
        title: program.title,
        category: program.category
      },
      notifications: {
        totalSent: notificationResults.success,
        failed: notificationResults.failed,
        totalUsers: users ? users.length : userPhoneNumbers?.length || 0
      }
    });

  } catch (error: any) {
    console.error('WhatsApp notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to send WhatsApp notifications', details: error.message },
      { status: 500 }
    );
  }
}

// GET: Get notification status and available users
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const includeUsers = searchParams.get('includeUsers') === 'true';

    let users = null;
    if (includeUsers) {
      users = await User.find({ role: 'user' }, { name: 1, phoneNumber: 1, email: 1 }).lean();
    }

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPrograms = await Program.countDocuments({ status: 'active' });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalActivePrograms: totalPrograms,
        whatsappConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
      },
      users: users ? users.map(user => ({
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email
      })) : null
    });

  } catch (error: any) {
    console.error('WhatsApp notification status API error:', error);
    return NextResponse.json(
      { error: 'Failed to get notification status', details: error.message },
      { status: 500 }
    );
  }
}
