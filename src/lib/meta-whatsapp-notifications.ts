// Meta WhatsApp Business API service (alternative to Twilio)
export interface MetaWhatsAppMessage {
  to: string;
  message: string;
  programTitle: string;
  programId: string;
}

export interface MetaWhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  method: string;
}

// Format phone number for Meta WhatsApp API
function formatPhoneNumberForMeta(phoneNumber: string): string {
  // Remove any non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // If it starts with 91 (India country code), keep as is
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return cleaned;
  }
  
  // If it's a 10-digit Indian number, add country code
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  // If it already has +, remove it for Meta API
  if (phoneNumber.startsWith('+')) {
    return phoneNumber.substring(1);
  }
  
  // Default: assume Indian number and add country code
  return `91${cleaned}`;
}

// Create WhatsApp message content for Meta API
function createMetaMessagePayload(
  to: string,
  programTitle: string,
  programId: string,
  category: string
): any {
  const messageText = `🎉 *New Government Program Available!*

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

  return {
    messaging_product: "whatsapp",
    to: formatPhoneNumberForMeta(to),
    type: "text",
    text: {
      body: messageText
    }
  };
}

// Send WhatsApp notification using Meta's WhatsApp Business API
export async function sendMetaWhatsAppNotification(
  phoneNumber: string,
  programTitle: string,
  programId: string,
  category: string = 'general'
): Promise<MetaWhatsAppResponse> {
  try {
    const accessToken = process.env.WHATSAPP_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      console.log('📱 [META WHATSAPP] Meta WhatsApp credentials not configured, using console notification');
      return sendConsoleMetaWhatsAppNotification(phoneNumber, programTitle, programId, category);
    }

    const formattedPhone = formatPhoneNumberForMeta(phoneNumber);
    const messagePayload = createMetaMessagePayload(formattedPhone, programTitle, programId, category);
    
    console.log('📱 [META WHATSAPP] Attempting to send notification to:', formattedPhone);
    console.log('📱 [META WHATSAPP] Program:', programTitle);

    // Meta WhatsApp Business API endpoint
    const apiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    });

    const responseData = await response.json();

    if (response.ok && responseData.messages) {
      const messageId = responseData.messages[0]?.id;
      console.log('✅ [META WHATSAPP] Message sent successfully:', messageId);
      
      return {
        success: true,
        messageId: messageId,
        method: 'meta-api'
      };
    } else {
      console.error('❌ [META WHATSAPP] API Error:', responseData);
      throw new Error(responseData.error?.message || 'Meta WhatsApp API request failed');
    }

  } catch (error: any) {
    console.error('❌ [META WHATSAPP] Error sending message:', error);
    
    // Fallback to console notification
    console.log('📱 [META WHATSAPP] Falling back to console notification');
    return sendConsoleMetaWhatsAppNotification(phoneNumber, programTitle, programId, category);
  }
}

// Fallback console notification for Meta API
function sendConsoleMetaWhatsAppNotification(
  phoneNumber: string,
  programTitle: string,
  programId: string,
  category: string
): MetaWhatsAppResponse {
  const formattedPhone = formatPhoneNumberForMeta(phoneNumber);
  const messagePayload = createMetaMessagePayload(formattedPhone, programTitle, programId, category);
  
  console.log('📱 ═══════════════════════════════════════════════════════════');
  console.log('📱 META WHATSAPP NOTIFICATION TRIGGERED');
  console.log('📱 ═══════════════════════════════════════════════════════════');
  console.log(`📱 Recipient: +${formattedPhone}`);
  console.log(`📱 Program: ${programTitle}`);
  console.log(`📱 Category: ${category}`);
  console.log(`📱 Program ID: ${programId}`);
  console.log('📱 ─────────────────────────────────────────────────────────────');
  console.log('📱 MESSAGE PAYLOAD:');
  console.log('📱 ─────────────────────────────────────────────────────────────');
  console.log(JSON.stringify(messagePayload, null, 2));
  console.log('📱 ═══════════════════════════════════════════════════════════');

  return {
    success: true,
    messageId: `meta-console-${Date.now()}`,
    method: 'console'
  };
}

// Send bulk Meta WhatsApp notifications
export async function sendBulkMetaWhatsAppNotifications(
  users: Array<{ phoneNumber: string; name?: string }>,
  programTitle: string,
  programId: string,
  category: string = 'general'
): Promise<{ success: number; failed: number; results: MetaWhatsAppResponse[] }> {
  console.log(`📱 [BULK META WHATSAPP] Sending notifications to ${users.length} users`);
  
  const results: MetaWhatsAppResponse[] = [];
  let success = 0;
  let failed = 0;

  // Send notifications with delay to respect API rate limits
  for (const user of users) {
    try {
      const result = await sendMetaWhatsAppNotification(
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
      
      // Delay to avoid rate limiting (Meta API has strict limits)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
    } catch (error) {
      console.error(`❌ [BULK META WHATSAPP] Failed for ${user.phoneNumber}:`, error);
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'error'
      });
      failed++;
    }
  }

  console.log(`📱 [BULK META WHATSAPP] Completed: ${success} success, ${failed} failed`);
  
  return { success, failed, results };
}

// Template message for Meta API (optional - requires pre-approved templates)
export async function sendMetaTemplateMessage(
  phoneNumber: string,
  templateName: string,
  templateLanguage: string = 'en',
  parameters: string[] = []
): Promise<MetaWhatsAppResponse> {
  try {
    const accessToken = process.env.WHATSAPP_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      throw new Error('Meta WhatsApp credentials not configured');
    }

    const formattedPhone = formatPhoneNumberForMeta(phoneNumber);
    
    const templatePayload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: templateLanguage
        },
        components: parameters.length > 0 ? [
          {
            type: "body",
            parameters: parameters.map(param => ({
              type: "text",
              text: param
            }))
          }
        ] : []
      }
    };

    const apiUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templatePayload),
    });

    const responseData = await response.json();

    if (response.ok && responseData.messages) {
      const messageId = responseData.messages[0]?.id;
      console.log('✅ [META TEMPLATE] Template message sent successfully:', messageId);
      
      return {
        success: true,
        messageId: messageId,
        method: 'meta-template'
      };
    } else {
      throw new Error(responseData.error?.message || 'Template message failed');
    }

  } catch (error: any) {
    console.error('❌ [META TEMPLATE] Error sending template message:', error);
    return {
      success: false,
      error: error.message,
      method: 'error'
    };
  }
}
