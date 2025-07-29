import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendIssueResolvedEmailResend(
  userEmail: string,
  issueTitle: string,
  issueId: string
) {
  console.log('🚀 [RESEND] Attempting to send email to:', userEmail);
  console.log('📧 [RESEND] API Key configured:', !!process.env.RESEND_API_KEY);
  console.log('📧 [RESEND] API Key value:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');

  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your-resend-api-key') {
    console.log('📝 [RESEND] TEST MODE - API key not configured properly');
    console.log('══════════════════════════════════════');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: ✅ Your Civic Issue Has Been Resolved`);
    console.log(`Issue ID: ${issueId}`);
    console.log(`Issue Title: ${issueTitle}`);
    console.log('Message: Your civic issue has been successfully resolved by our tech team.');
    console.log('══════════════════════════════════════');
    console.log('⚠️ To send real emails, get a valid API key from https://resend.com');
    
    return { 
      success: true, 
      messageId: 'test-mode-resend-' + Date.now(),
      testMode: true 
    };
  }

  try {
    // Simple test with basic email
    const emailContent = {
      from: 'onboarding@resend.dev',
      to: userEmail,
      subject: '✅ Your Civic Issue Has Been Resolved',
      text: `
Dear User,

Great news! Your civic issue has been successfully resolved by our technical team.

Issue Details:
- Issue ID: ${issueId}
- Title: ${issueTitle}
- Status: ✅ RESOLVED
- Resolved At: ${new Date().toLocaleString()}

Thank you for reporting this issue and helping us improve our community.

Best regards,
The Civic Management Team
      `,
    };

    console.log('📬 [RESEND] Sending simple text email...');
    const { data, error } = await resend.emails.send(emailContent);

    if (error) {
      console.error('❌ [RESEND] Error details:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }

    console.log('✅ [RESEND] Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };

  } catch (error: any) {
    console.error('❌ [RESEND] Unexpected error:', error);
    return { success: false, error: error.message };
  }
}
