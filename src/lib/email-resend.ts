import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendIssueResolvedEmailResend(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 [RESEND] Attempting to send email to:', userEmail);
  console.log('📧 [RESEND] API Key configured:', !!process.env.RESEND_API_KEY);

  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('📝 [RESEND] TEST MODE - Would send email:');
    console.log('══════════════════════════════════════');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ✅ Your Civic Issue Has Been Resolved`);
    console.log(`Issue ID: ${issueId}`);
    console.log(`Issue Title: ${issueTitle}`);
    console.log('Message: Your civic issue has been successfully resolved by our tech team.');
    console.log('══════════════════════════════════════');
    console.log('⚠️ To send real emails, get a free API key from https://resend.com');
    
    return { 
      success: true, 
      messageId: 'test-mode-resend-' + Date.now(),
      testMode: true 
    };
  }

  try {
    const emailContent = {
      from: 'onboarding@resend.dev', // Resend verified domain for testing
      to: [userEmail],
      subject: '✅ Your Civic Issue Has Been Resolved',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Issue Resolved</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f6f9fc;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .email-wrapper {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .content h2 {
              color: #333;
              margin-top: 0;
              margin-bottom: 16px;
              font-size: 24px;
            }
            .content p {
              color: #666;
              line-height: 1.6;
              margin-bottom: 16px;
            }
            .issue-details {
              background-color: #f8fffe;
              border: 1px solid #e1f5fe;
              border-left: 4px solid #4CAF50;
              padding: 20px;
              margin: 24px 0;
              border-radius: 4px;
            }
            .issue-details strong {
              color: #333;
            }
            .issue-id {
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 14px;
              background-color: #f5f5f5;
              padding: 4px 8px;
              border-radius: 3px;
              color: #666;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 0;
              color: #6c757d;
              font-size: 14px;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="email-wrapper">
              <div class="header">
                <div class="success-icon">🎉</div>
                <h1>Issue Resolved!</h1>
              </div>
              <div class="content">
                <h2>Great News!</h2>
                <p>We're delighted to inform you that your civic issue has been successfully resolved by our technical team.</p>
                
                <div class="issue-details">
                  <p><strong>Issue ID:</strong> <span class="issue-id">${issueId}</span></p>
                  <p><strong>Issue Title:</strong> ${issueTitle}</p>
                  <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: 600;">✅ Resolved</span></p>
                </div>
                
                <p>Thank you for taking the time to report this issue. Your contribution helps us maintain and improve our community infrastructure.</p>
                
                <p>If you have any questions about this resolution or need to report another issue, please don't hesitate to contact us through our platform.</p>
                
                <p style="margin-top: 30px;">
                  <strong>Best regards,</strong><br>
                  The Civic Management Team
                </p>
              </div>
              <div class="footer">
                <p>© 2025 Civic Management & Reporting System</p>
                <p>This is an automated notification. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('📬 [RESEND] Sending email...');
    const { data, error } = await resend.emails.send(emailContent);

    if (error) {
      console.error('❌ [RESEND] Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ [RESEND] Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };

  } catch (error: any) {
    console.error('❌ [RESEND] Unexpected error:', error);
    return { success: false, error: error.message };
  }
}
