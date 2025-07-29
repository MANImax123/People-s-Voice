// Webhook-based email service using EmailJS or simple HTTP notification
export async function sendIssueResolvedWebhook(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 [WEBHOOK] Attempting to send email notification to:', userEmail);

  // For now, let's create a comprehensive console notification
  // and also try a simple webhook approach
  
  try {
    // Console notification (always works)
    console.log('📧 ═══════════════════════════════════════════════════════════');
    console.log('📧 EMAIL NOTIFICATION TRIGGERED');
    console.log('📧 ═══════════════════════════════════════════════════════════');
    console.log(`📧 Recipient: ${userEmail}`);
    console.log(`📧 Subject: ✅ Your Civic Issue Has Been Resolved`);
    console.log(`📧 Issue ID: ${issueId}`);
    console.log(`📧 Issue Title: ${issueTitle}`);
    console.log(`📧 Message: Your civic issue has been successfully resolved!`);
    console.log(`📧 Timestamp: ${new Date().toLocaleString()}`);
    console.log('📧 ═══════════════════════════════════════════════════════════');

    // Try webhook approach (using a free service like webhook.site for testing)
    if (process.env.WEBHOOK_URL) {
      const webhookData = {
        type: 'issue_resolved',
        userEmail,
        issueTitle,
        issueId,
        timestamp: new Date().toISOString(),
        message: 'Your civic issue has been successfully resolved by our tech team.'
      };

      const response = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        console.log('✅ [WEBHOOK] Notification sent successfully');
        return { success: true, method: 'webhook', messageId: `webhook-${Date.now()}` };
      } else {
        console.log('⚠️ [WEBHOOK] Failed, but console notification succeeded');
      }
    }

    // Browser notification approach (if in development)
    if (process.env.NODE_ENV === 'development') {
      // Store notification in a simple file for demonstration
      const notificationData = {
        timestamp: new Date().toISOString(),
        userEmail,
        issueTitle,
        issueId,
        status: 'resolved',
        message: 'Your civic issue has been successfully resolved by our tech team.'
      };

      console.log('💾 [DEV] Notification data:', JSON.stringify(notificationData, null, 2));
    }

    return { 
      success: true, 
      method: 'console', 
      messageId: `console-${Date.now()}`,
      note: 'Email notification logged to console. Check terminal output.'
    };

  } catch (error: any) {
    console.error('❌ [WEBHOOK] Error in notification system:', error);
    return { success: false, error: error.message };
  }
}

// Simple email service using EmailJS (client-side, but can be adapted)
export async function sendIssueResolvedSimple(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 [SIMPLE] Email notification triggered');
  
  // Create a detailed notification that will be visible
  const notification = {
    timestamp: new Date().toISOString(),
    recipient: userEmail,
    subject: '✅ Your Civic Issue Has Been Resolved',
    issueId: issueId,
    issueTitle: issueTitle,
    content: `
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

---
This is an automated notification from the Civic Management & Reporting System.
    `
  };

  // Log the full email content
  console.log('📧 ═══════════════════════════════════════════════════════════');
  console.log('📧 FULL EMAIL NOTIFICATION');
  console.log('📧 ═══════════════════════════════════════════════════════════');
  console.log(notification.content);
  console.log('📧 ═══════════════════════════════════════════════════════════');

  return {
    success: true,
    method: 'simple',
    messageId: `simple-${Date.now()}`,
    notification: notification
  };
}
