import twilio from 'twilio';

interface WhatsAppMessage {
  to: string;
  message: string;
  title?: string;
}

export class TwilioWhatsAppService {
  private client: twilio.Twilio | null = null;
  private from: string;
  private isConfigured: boolean = false;

  constructor() {
    this.from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;

      if (!accountSid || !authToken) {
        console.log('⚠️ Twilio credentials not found. WhatsApp messages will be logged to console.');
        this.isConfigured = false;
        return;
      }

      if (accountSid.includes('your_') || authToken.includes('your_')) {
        console.log('⚠️ Twilio credentials are placeholders. WhatsApp messages will be logged to console.');
        this.isConfigured = false;
        return;
      }

      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;
      console.log('✅ Twilio WhatsApp service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio client:', error);
      this.isConfigured = false;
    }
  }

  async sendWhatsAppMessage({ to, message, title }: WhatsAppMessage): Promise<boolean> {
    try {
      // Ensure phone number has proper WhatsApp format
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      // Combine title and message
      const fullMessage = title ? `*${title}*\n\n${message}` : message;

      if (!this.isConfigured || !this.client) {
        console.log('📱 WhatsApp Message (Console Mode):');
        console.log(`To: ${formattedTo}`);
        console.log(`Message: ${fullMessage}`);
        console.log('---');
        return true;
      }

      const result = await this.client.messages.create({
        body: fullMessage,
        from: this.from,
        to: formattedTo,
      });

      console.log(`✅ WhatsApp message sent successfully. SID: ${result.sid}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send WhatsApp message:', error);
      
      // Fallback to console logging
      console.log('📱 WhatsApp Message (Fallback Mode):');
      console.log(`To: ${to}`);
      console.log(`Message: ${title ? `*${title}*\n\n${message}` : message}`);
      console.log('---');
      
      return false;
    }
  }

  async sendBulkWhatsAppMessages(messages: WhatsAppMessage[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    console.log(`📤 Sending ${messages.length} WhatsApp messages...`);

    for (const message of messages) {
      const result = await this.sendWhatsAppMessage(message);
      if (result) {
        success++;
      } else {
        failed++;
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`📊 WhatsApp Bulk Send Results: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  getConfigurationStatus(): { configured: boolean; from: string; mode: string } {
    return {
      configured: this.isConfigured,
      from: this.from,
      mode: this.isConfigured ? 'Twilio API' : 'Console Mode'
    };
  }
}

// Export singleton instance
export const twilioWhatsApp = new TwilioWhatsAppService();
