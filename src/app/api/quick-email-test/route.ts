import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Quick email test - bypassing validation');
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS available:', !!process.env.EMAIL_PASS);

    // Use a hardcoded email for testing
    const testEmail = 'lenkalapellymaniteja142@gmail.com';
    console.log('📧 Using hardcoded test email:', testEmail);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test the connection
    console.log('🔍 Verifying transporter connection...');
    await transporter.verify();
    console.log('✅ Transporter connection verified');

    // Send test email
    console.log('📤 Sending quick test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: '🚀 Quick Email Test - No Validation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">🚀 Quick Test Email!</h2>
          <p>This is a quick test email with no validation to test if the basic email sending works.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
      `,
    });

    console.log('✅ Quick test email sent successfully:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'Quick test email sent successfully',
      messageId: result.messageId,
      from: process.env.EMAIL_USER,
      to: testEmail
    });

  } catch (error: any) {
    console.error('❌ Quick email test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Quick email test failed',
      details: {
        message: error?.message || 'Unknown error',
        code: error?.code || 'No code',
        response: error?.response || 'No response'
      }
    }, { status: 500 });
  }
}
