import nodemailer from 'nodemailer';

// Create reusable transporter object
const createTransporter = () => {
  // For testing without real email credentials
  if (process.env.EMAIL_USER === 'your-email@gmail.com' || !process.env.EMAIL_USER) {
    console.log('📧 Using test email configuration (Ethereal)');
    // Create test account for development
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'pass'
      }
    });
  }

  // Production configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const transporter = createTransporter();

export async function sendIssueResolvedEmail(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 Attempting to send email to:', userEmail);
  console.log('📧 Email config:', {
    user: process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASS
  });

  // Check if email is configured with real credentials
  const isTestMode = !process.env.EMAIL_USER || 
                     process.env.EMAIL_USER === 'your-email@gmail.com' || 
                     !process.env.EMAIL_PASS || 
                     process.env.EMAIL_PASS === 'your-app-password';

  if (isTestMode) {
    console.log('📝 EMAIL TEST MODE - Would send email:');
    console.log('══════════════════════════════════════');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ✅ Your Civic Issue Has Been Resolved`);
    console.log(`Issue ID: ${issueId}`);
    console.log(`Issue Title: ${issueTitle}`);
    console.log('Message: Your civic issue has been successfully resolved by our tech team.');
    console.log('══════════════════════════════════════');
    console.log('⚠️ To send real emails, configure EMAIL_USER and EMAIL_PASS in .env.local');
    
    return { 
      success: true, 
      messageId: 'test-mode-' + Date.now(),
      testMode: true 
    };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: '✅ Your Civic Issue Has Been Resolved',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #f9f9f9;
            }
            .footer {
              padding: 15px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .issue-id {
              background-color: #e8f5e8;
              padding: 10px;
              border-radius: 4px;
              margin: 10px 0;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Issue Resolved!</h1>
            </div>
            <div class="content">
              <h2>Good News!</h2>
              <p>We're pleased to inform you that your civic issue has been successfully resolved by our tech team.</p>
              
              <div class="issue-id">
                <strong>Issue ID:</strong> ${issueId}<br>
                <strong>Issue Title:</strong> ${issueTitle}
              </div>
              
              <p>Thank you for reporting this issue and helping us improve our community. Your contribution makes a difference!</p>
              
              <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>© 2024 Civic Management & Reporting System</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('📬 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
}
