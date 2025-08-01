import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MeetingRequest from '@/models/MeetingRequest';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { 
      requestId, 
      selectedDate, 
      selectedTime, 
      meetingDescription, 
      userId 
    } = await request.json();

    if (!requestId || !selectedDate || !selectedTime || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the meeting request
    const meetingRequest = await MeetingRequest.findById(requestId);
    if (!meetingRequest) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    // Verify user owns this request
    if (meetingRequest.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (meetingRequest.status !== 'approved') {
      return NextResponse.json(
        { error: 'Meeting request must be approved before scheduling' },
        { status: 400 }
      );
    }

    // Validate date is in the future
    const selectedDateTime = new Date(selectedDate);
    if (selectedDateTime <= new Date()) {
      return NextResponse.json(
        { error: 'Selected date must be in the future' },
        { status: 400 }
      );
    }

    // Check if the selected slot is available (basic check)
    const existingMeeting = await MeetingRequest.findOne({
      selectedDate: selectedDateTime,
      selectedTime,
      status: 'scheduled'
    });

    if (existingMeeting) {
      return NextResponse.json(
        { error: 'Selected time slot is already booked. Please choose another time.' },
        { status: 400 }
      );
    }

    // Update meeting request with scheduling details
    meetingRequest.selectedDate = selectedDateTime;
    meetingRequest.selectedTime = selectedTime;
    meetingRequest.meetingDescription = meetingDescription || meetingRequest.meetingDescription;
    meetingRequest.status = 'scheduled';

    await meetingRequest.save();

    // Send confirmation emails to both user and admin
    try {
      const meetingDateFormatted = selectedDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Email to user
      const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #22c55e;">🗓️ Meeting Scheduled Successfully!</h2>
        
        <p>Dear ${meetingRequest.userName},</p>
        
        <p>Your meeting with the Municipal Corporation has been scheduled. Here are the details:</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Meeting Details</h3>
          <p><strong>📅 Date:</strong> ${meetingDateFormatted}</p>
          <p><strong>🕐 Time:</strong> ${selectedTime}</p>
          <p><strong>📋 Type:</strong> ${meetingRequest.meetingType.replace('_', ' ')}</p>
          <p><strong>⚡ Priority:</strong> ${meetingRequest.priority.toUpperCase()}</p>
          ${meetingDescription ? `<p><strong>📝 Description:</strong> ${meetingDescription}</p>` : ''}
        </div>
        
        <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #ca8a04; margin-top: 0;">Important Notes:</h4>
          <ul>
            <li>Please arrive 10 minutes early</li>
            <li>Bring a valid photo ID</li>
            <li>Bring any relevant documents</li>
            <li>Contact us 24 hours in advance for any changes</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p><strong>Location:</strong> Municipal Corporation Office<br>
          Main Conference Room, 2nd Floor</p>
          
          <p><strong>Contact:</strong> ${process.env.EMAIL_USER}<br>
          Phone: +91-XXXXX-XXXXX</p>
        </div>
      </div>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: meetingRequest.userEmail,
        subject: '🗓️ Meeting Scheduled - Municipal Corporation',
        html: userEmailContent,
      });

      // Email to admin (using default admin email)
      const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">📅 New Meeting Scheduled</h2>
        
        <p>A citizen has scheduled their approved meeting. Details below:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Meeting Details</h3>
          <p><strong>Citizen:</strong> ${meetingRequest.userName}</p>
          <p><strong>Email:</strong> ${meetingRequest.userEmail}</p>
          <p><strong>Phone:</strong> ${meetingRequest.userPhone}</p>
          <p><strong>Date:</strong> ${meetingDateFormatted}</p>
          <p><strong>Time:</strong> ${selectedTime}</p>
          <p><strong>Type:</strong> ${meetingRequest.meetingType.replace('_', ' ')}</p>
          <p><strong>Priority:</strong> ${meetingRequest.priority.toUpperCase()}</p>
          ${meetingDescription ? `<p><strong>Description:</strong> ${meetingDescription}</p>` : ''}
        </div>
        
        <p>Please ensure the conference room is available and any necessary preparations are made.</p>
      </div>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin email
        subject: '📅 New Meeting Scheduled - Admin Notification',
        html: adminEmailContent,
      });

    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting scheduled successfully',
      meetingDetails: {
        date: selectedDateTime,
        time: selectedTime,
        description: meetingDescription
      }
    });

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
