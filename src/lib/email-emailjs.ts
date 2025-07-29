import emailjs from '@emailjs/nodejs';

export async function sendIssueResolvedEmailJS(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 [EMAILJS] Attempting to send email to:', userEmail);

  // Check if EmailJS is configured
  if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_USER_ID) {
    console.log('📝 [EMAILJS] TEST MODE - EmailJS not configured');
    console.log('══════════════════════════════════════');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ✅ Your Civic Issue Has Been Resolved`);
    console.log(`Issue ID: ${issueId}`);
    console.log(`Issue Title: ${issueTitle}`);
    console.log('Message: Your civic issue has been successfully resolved by our tech team.');
    console.log('══════════════════════════════════════');
    console.log('⚠️ To use EmailJS, configure EMAILJS_* variables in .env.local');
    
    return { 
      success: true, 
      messageId: 'test-mode-emailjs-' + Date.now(),
      testMode: true 
    };
  }

  try {
    const templateParams = {
      to_email: userEmail,
      to_name: 'Civic Platform User',
      subject: 'Your Civic Issue Has Been Resolved',
      issue_id: issueId,
      issue_title: issueTitle,
      resolved_date: new Date().toLocaleDateString(),
      resolved_time: new Date().toLocaleTimeString(),
      message: `
Dear User,

Great news! Your civic issue has been successfully resolved by our technical team.

Issue Details:
- Issue ID: ${issueId}
- Title: ${issueTitle}
- Status: ✅ RESOLVED
- Resolved At: ${new Date().toLocaleString()}

Thank you for reporting this issue and helping us improve our community. Your contribution makes a real difference!

If you have any questions about this resolution or need to report another issue, please visit our platform.

Best regards,
The Civic Management Team
      `
    };

    console.log('📬 [EMAILJS] Sending email via EmailJS...');
    
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.EMAILJS_USER_ID!,
      }
    );

    console.log('✅ [EMAILJS] Email sent successfully:', response.text);
    return { success: true, messageId: response.text };

  } catch (error: any) {
    console.error('❌ [EMAILJS] Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Simple HTTP webhook sender
export async function sendEmailViaWebhook(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 [WEBHOOK] Sending notification via webhook');

  try {
    // Try a simple webhook service (you can use webhook.site for testing)
    const webhookUrl = 'https://webhook.site/unique-webhook-id'; // Replace with actual webhook URL
    
    const payload = {
      type: 'issue_resolved',
      timestamp: new Date().toISOString(),
      data: {
        recipient_email: userEmail,
        issue_id: issueId,
        issue_title: issueTitle,
        message: 'Your civic issue has been successfully resolved by our tech team.',
        subject: '✅ Your Civic Issue Has Been Resolved'
      }
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('✅ [WEBHOOK] Notification sent successfully');
      return { success: true, messageId: `webhook-${Date.now()}` };
    } else {
      console.log('❌ [WEBHOOK] Failed to send notification');
      return { success: false, error: 'Webhook request failed' };
    }

  } catch (error: any) {
    console.error('❌ [WEBHOOK] Error:', error);
    return { success: false, error: error.message };
  }
}
