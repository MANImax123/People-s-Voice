import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📨 Request body:', body);
    
    const { to } = body;
    console.log('📧 Extracted email:', to, 'Type:', typeof to);
    console.log('📧 Email length:', to?.length);
    console.log('📧 Email characters:', JSON.stringify(to));

    if (!to || to.trim() === '') {
      console.log('❌ No email address provided');
      return NextResponse.json(
        { error: 'Email address is required and cannot be empty' },
        { status: 400 }
      );
    }

    const trimmedEmail = to.trim();
    console.log('📧 Trimmed email:', trimmedEmail);
    console.log('📧 Trimmed email length:', trimmedEmail.length);
    console.log('📧 Trimmed email characters:', JSON.stringify(trimmedEmail));

    // More lenient email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log('🔍 Testing email against regex:', emailRegex.test(trimmedEmail));
    
    if (!emailRegex.test(trimmedEmail)) {
      console.log('❌ Invalid email format:', trimmedEmail);
      console.log('❌ Email regex test failed for:', JSON.stringify(trimmedEmail));
      return NextResponse.json(
        { 
          error: 'Invalid email format',
          receivedEmail: trimmedEmail,
          emailLength: trimmedEmail.length
        },
        { status: 400 }
      );
    }
    console.log('📧 Final email to send to:', trimmedEmail);

    console.log('🧪 Testing email configuration...');
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS available:', !!process.env.EMAIL_PASS);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug mode
      logger: true // Enable logging
    });

    // Test the connection
    console.log('🔍 Verifying transporter connection...');
    await transporter.verify();
    console.log('✅ Transporter connection verified');

    // Send test email
    console.log('📤 Sending test email to:', trimmedEmail);
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: trimmedEmail,
      subject: '🧪 Test Email from People\'s Voice Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">🧪 Email Test Successful!</h2>
          <p>This is a test email from the People's Voice civic engagement platform.</p>
          <p>If you received this email, it means the email configuration is working correctly!</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent from: ${process.env.EMAIL_USER}</li>
              <li>Timestamp: ${new Date().toISOString()}</li>
              <li>Platform: People's Voice</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            This email was sent as part of email configuration testing.
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      from: process.env.EMAIL_USER,
      to: trimmedEmail
    });

  } catch (error: any) {
    console.error('❌ Email test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Email test failed',
      details: {
        message: error?.message || 'Unknown error',
        code: error?.code || 'No code',
        response: error?.response || 'No response'
      }
    }, { status: 500 });
  }
}
