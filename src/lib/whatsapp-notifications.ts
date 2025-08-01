// WhatsApp notification service using Twilio or Meta WhatsApp Business API
import { sendMetaWhatsAppNotification, sendBulkMetaWhatsAppNotifications } from './meta-whatsapp-notifications';

export interface WhatsAppMessage {
  to: string;
  message: string;
  programTitle: string;
  programId: string;
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  method: string;
}

// Format phone number for WhatsApp (ensure it has country code)
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 91 (India country code), keep as is
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  
  // If it's a 10-digit Indian number, add country code
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it already has +, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Default: assume Indian number and add country code
  return `+91${cleaned}`;
}

// Create WhatsApp message content for new program
function createProgramMessage(programTitle: string, programId: string, category: string): string {
  return `🎉 *New Government Program Available!*

📋 *Program:* ${programTitle}
🏷️ *Category:* ${category.charAt(0).toUpperCase() + category.slice(1)}
🆔 *Program ID:* ${programId}

📝 A new government program has been launched that might benefit you!

✅ Visit our platform to:
- View complete program details
- Check eligibility criteria
- Apply if you qualify
- Get contact information

🔗 *Visit:* Your Civic Platform

Thank you for being part of our community!
*- Civic Management Team*`;
}

// Send WhatsApp notification - tries Meta API first, then Twilio
export async function sendWhatsAppNotification(
  phoneNumber: string,
  programTitle: string,
  programId: string,
  category: string = 'general'
): Promise<WhatsAppResponse> {
  console.log('📱 [WHATSAPP] Starting notification process');
  
  // Try Meta WhatsApp Business API first
  const metaApiToken = process.env.WHATSAPP_API_TOKEN;
  const metaPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (metaApiToken && metaPhoneNumberId) {
    console.log('📱 [WHATSAPP] Using Meta WhatsApp Business API');
    try {
      const metaResult = await sendMetaWhatsAppNotification(phoneNumber, programTitle, programId, category);
      if (metaResult.success) {
        return metaResult;
      }
    } catch (error) {
      console.log('📱 [WHATSAPP] Meta API failed, trying Twilio...');
    }
  }
  
  // Fall back to Twilio
  return sendTwilioWhatsAppNotification(phoneNumber, programTitle, programId, category);
}

// Send WhatsApp notification using Twilio (renamed from original function)
async function sendTwilioWhatsAppNotification(
  phoneNumber: string,
  programTitle: string,
  programId: string,
  category: string = 'general'
): Promise<WhatsAppResponse> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = createProgramMessage(programTitle, programId, category);
    
    console.log('📱 [WHATSAPP] Attempting to send notification to:', formattedPhone);
    console.log('📱 [WHATSAPP] Program:', programTitle);

    // Check if Twilio credentials are available
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // Should be like 'whatsapp:+14155238886'
    
    if (!accountSid || !authToken || !whatsappFrom) {
      console.log('📱 [WHATSAPP] Twilio credentials not configured, using console notification');
      return sendConsoleWhatsAppNotification(formattedPhone, programTitle, programId, category);
    }

    // Initialize Twilio client
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);
    
    // Send WhatsApp message
    const messageResponse = await client.messages.create({
      body: message,
      from: whatsappFrom,
      to: `whatsapp:${formattedPhone}`
    });

    console.log('✅ [WHATSAPP] Message sent successfully:', messageResponse.sid);
    
    return {
      success: true,
      messageId: messageResponse.sid,
      method: 'twilio'
    };

  } catch (error: any) {
    console.error('❌ [WHATSAPP] Error sending message:', error);
    
    // Fallback to console notification
    console.log('📱 [WHATSAPP] Falling back to console notification');
    return sendConsoleWhatsAppNotification(phoneNumber, programTitle, programId, category);
  }
}

// Fallback console notification (for development/testing)
function sendConsoleWhatsAppNotification(
  phoneNumber: string,
  programTitle: string,
  programId: string,
  category: string
): WhatsAppResponse {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const message = createProgramMessage(programTitle, programId, category);
  
  console.log('📱 ═══════════════════════════════════════════════════════════');
  console.log('📱 WHATSAPP NOTIFICATION TRIGGERED');
  console.log('📱 ═══════════════════════════════════════════════════════════');
  console.log(`📱 Recipient: ${formattedPhone}`);
  console.log(`📱 Program: ${programTitle}`);
  console.log(`📱 Category: ${category}`);
  console.log(`📱 Program ID: ${programId}`);
  console.log('📱 ─────────────────────────────────────────────────────────────');
  console.log('📱 MESSAGE CONTENT:');
  console.log('📱 ─────────────────────────────────────────────────────────────');
  console.log(message);
  console.log('📱 ═══════════════════════════════════════════════════════════');

  return {
    success: true,
    messageId: `console-${Date.now()}`,
    method: 'console'
  };
}

// Send WhatsApp notifications to multiple users - tries Meta API first, then Twilio
export async function sendBulkWhatsAppNotifications(
  users: Array<{ phoneNumber: string; name?: string }>,
  programTitle: string,
  programId: string,
  category: string = 'general'
): Promise<{ success: number; failed: number; results: WhatsAppResponse[] }> {
  console.log(`📱 [BULK WHATSAPP] Sending notifications to ${users.length} users`);
  
  // Try Meta WhatsApp Business API first
  const metaApiToken = process.env.WHATSAPP_API_TOKEN;
  const metaPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (metaApiToken && metaPhoneNumberId) {
    console.log('📱 [BULK WHATSAPP] Using Meta WhatsApp Business API');
    try {
      return await sendBulkMetaWhatsAppNotifications(users, programTitle, programId, category);
    } catch (error) {
      console.log('📱 [BULK WHATSAPP] Meta API failed, trying Twilio...');
    }
  }
  
  // Fall back to Twilio bulk messaging
  return sendBulkTwilioWhatsAppNotifications(users, programTitle, programId, category);
}

// Send bulk WhatsApp notifications using Twilio (renamed from original function)
async function sendBulkTwilioWhatsAppNotifications(
  users: Array<{ phoneNumber: string; name?: string }>,
  programTitle: string,
  programId: string,
  category: string = 'general'
): Promise<{ success: number; failed: number; results: WhatsAppResponse[] }> {
  console.log(`📱 [BULK WHATSAPP] Sending notifications to ${users.length} users`);
  
  const results: WhatsAppResponse[] = [];
  let success = 0;
  let failed = 0;

  // Send notifications with a small delay to avoid rate limiting
  for (const user of users) {
    try {
      const result = await sendWhatsAppNotification(
        user.phoneNumber,
        programTitle,
        programId,
        category
      );
      
      results.push(result);
      
      if (result.success) {
        success++;
      } else {
        failed++;
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ [BULK WHATSAPP] Failed for ${user.phoneNumber}:`, error);
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'error'
      });
      failed++;
    }
  }

  console.log(`📱 [BULK WHATSAPP] Completed: ${success} success, ${failed} failed`);
  
  return { success, failed, results };
}

// Send WhatsApp notification for program updates (optional)
export async function sendProgramUpdateNotification(
  phoneNumber: string,
  programTitle: string,
  programId: string,
  updateType: string = 'updated'
): Promise<WhatsAppResponse> {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  const message = `📢 *Program Update Notice*

📋 *Program:* ${programTitle}
🆔 *Program ID:* ${programId}
🔄 *Status:* ${updateType.charAt(0).toUpperCase() + updateType.slice(1)}

The program details have been updated. Please check the latest information on our platform.

🔗 *Visit:* Your Civic Platform

*- Civic Management Team*`;

  console.log('📱 [WHATSAPP UPDATE] Sending program update notification');
  
  // For now, use console notification (can be extended with actual WhatsApp API)
  console.log('📱 ═══════════════════════════════════════════════════════════');
  console.log('📱 PROGRAM UPDATE WHATSAPP NOTIFICATION');
  console.log('📱 ═══════════════════════════════════════════════════════════');
  console.log(`📱 Recipient: ${formattedPhone}`);
  console.log(`📱 Program: ${programTitle}`);
  console.log(`📱 Update Type: ${updateType}`);
  console.log('📱 ─────────────────────────────────────────────────────────────');
  console.log(message);
  console.log('📱 ═══════════════════════════════════════════════════════════');

  return {
    success: true,
    messageId: `update-${Date.now()}`,
    method: 'console'
  };
}
