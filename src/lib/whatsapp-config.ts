export function getWhatsAppConfig() {
  const metaToken = process.env.WHATSAPP_API_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFromNumber = process.env.TWILIO_WHATSAPP_FROM;

  const hasMetaConfig = metaToken && metaPhoneId;
  const hasTwilioConfig = twilioAccountSid && twilioAuthToken && twilioFromNumber;

  return {
    isConfigured: hasMetaConfig || hasTwilioConfig,
    primaryApi: hasMetaConfig ? 'Meta WhatsApp Business API' : hasTwilioConfig ? 'Twilio WhatsApp API' : 'Console Mode',
    hasMetaConfig,
    hasTwilioConfig,
    configStatus: {
      meta: {
        token: !!metaToken,
        phoneId: !!metaPhoneId
      },
      twilio: {
        accountSid: !!twilioAccountSid,
        authToken: !!twilioAuthToken,
        fromNumber: !!twilioFromNumber
      }
    }
  };
}

export function getConfigurationGuide() {
  const config = getWhatsAppConfig();
  
  if (config.isConfigured) {
    return {
      status: 'ready',
      message: `WhatsApp notifications are configured using ${config.primaryApi}`,
      nextSteps: []
    };
  }

  return {
    status: 'needs-setup',
    message: 'WhatsApp notifications need configuration',
    nextSteps: [
      'Check WHATSAPP_SETUP_GUIDE.md in your project root',
      'Choose between Meta WhatsApp Business API (recommended) or Twilio',
      'Follow the setup instructions for your chosen API',
      'Add the required environment variables to .env.local'
    ]
  };
}
