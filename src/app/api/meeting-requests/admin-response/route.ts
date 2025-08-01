import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MeetingRequest from '@/models/MeetingRequest';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

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
    
    const { requestId, action, adminId, adminResponse } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
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

    if (meetingRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Meeting request has already been processed' },
        { status: 400 }
      );
    }

    // Update meeting request
    meetingRequest.status = action === 'approve' ? 'approved' : 'rejected';
    
    // Only set adminId if it's a valid ObjectId, otherwise leave it undefined
    if (adminId && adminId !== 'admin_default' && mongoose.Types.ObjectId.isValid(adminId)) {
      meetingRequest.adminId = adminId;
    }
    
    meetingRequest.adminResponse = adminResponse || '';
    meetingRequest.approvedDate = action === 'approve' ? new Date() : undefined;

    await meetingRequest.save();

    // Send email notification to user
    try {
      console.log('📧 Attempting to send email to:', meetingRequest.userEmail);
      console.log('📧 Email User Config:', process.env.EMAIL_USER);
      console.log('📧 Email Pass Available:', !!process.env.EMAIL_PASS);

      const emailSubject = action === 'approve' 
        ? '✅ Your Meeting Request has been Approved!'
        : '❌ Your Meeting Request Update';

      const emailContent = action === 'approve' 
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">🎉 Great News! Your Meeting Request is Approved</h2>
          
          <p>Dear ${meetingRequest.userName},</p>
          
          <p>Your request to meet with the Municipal Corporation has been <strong>approved</strong>!</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">Next Steps:</h3>
            <ol>
              <li>Log in to your account</li>
              <li>Go to the Meeting Requests section</li>
              <li>Select your preferred date and time</li>
              <li>Add any additional details about your meeting</li>
            </ol>
          </div>
          
          ${adminResponse ? `
          <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #ca8a04; margin-top: 0;">Admin Message:</h4>
            <p style="margin-bottom: 0;">${adminResponse}</p>
          </div>
          ` : ''}
          
          <p><strong>Meeting Type:</strong> ${meetingRequest.meetingType.replace('_', ' ')}</p>
          <p><strong>Priority:</strong> ${meetingRequest.priority.toUpperCase()}</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Please complete your scheduling within 7 days. If you need to reschedule or cancel, 
              please contact us at least 24 hours in advance.
            </p>
          </div>
        </div>
        `
        : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Meeting Request Update</h2>
          
          <p>Dear ${meetingRequest.userName},</p>
          
          <p>Thank you for your interest in meeting with the Municipal Corporation. 
          After careful review, we are unable to approve your meeting request at this time.</p>
          
          ${adminResponse ? `
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #dc2626; margin-top: 0;">Reason:</h4>
            <p style="margin-bottom: 0;">${adminResponse}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">Alternative Options:</h3>
            <ul>
              <li>You can submit a new request with more details</li>
              <li>Contact our citizen helpline for immediate assistance</li>
              <li>Visit our office during public hours (Mon-Fri, 9 AM - 5 PM)</li>
            </ul>
          </div>
        </div>
        `;

      console.log('📧 Sending email with subject:', emailSubject);
      
      const emailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: meetingRequest.userEmail,
        subject: emailSubject,
        html: emailContent,
      });

      console.log('✅ Email sent successfully:', emailResult.messageId);

    } catch (emailError: any) {
      console.error('❌ Error sending email:', emailError);
      console.error('📧 Full email error details:', {
        error: emailError?.message || 'Unknown error',
        code: emailError?.code || 'No code',
        response: emailError?.response || 'No response'
      });
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: `Meeting request ${action}d successfully`,
      status: meetingRequest.status
    });

  } catch (error) {
    console.error('Error processing meeting request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
