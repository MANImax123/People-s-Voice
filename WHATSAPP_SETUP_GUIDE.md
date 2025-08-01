# WhatsApp API Setup Guide - Complete Instructions

## Overview
This guide covers TWO options for WhatsApp integration:
1. **Meta WhatsApp Business API** (Official, free tier available)
2. **Twilio WhatsApp API** (Third-party, paid service)

The system will automatically try Meta API first, then fall back to Twilio if Meta is not configured.

---

## Option 1: Meta WhatsApp Business API (Recommended)

### Prerequisites
- A Meta (Facebook) Developer account
- A Facebook Business account (free)
- A phone number for WhatsApp Business

### Step 1: Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "Get Started" 
3. Sign up with your Facebook account or create new
4. Complete account verification if prompted

### Step 2: Create a Business App
1. Visit [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Select "Business" as app type
4. Fill in details:
   - **App Name**: "Civic Platform WhatsApp" (or your choice)
   - **App Contact Email**: Your email address
   - **Business Portfolio**: Create new or select existing

### Step 3: Add WhatsApp Product
1. In your app dashboard, find "Add Products to Your App"
2. Locate "WhatsApp" and click "Set up"
3. The WhatsApp product will be added to your app

### Step 4: Get Phone Number ID
1. Go to WhatsApp > API Setup
2. You'll see a test phone number provided by Meta
3. **Copy the Phone Number ID** (long number like: 123456789012345)
4. This is your `WHATSAPP_PHONE_NUMBER_ID`

### Step 5: Get Access Token
1. In the same API Setup section, you'll see a temporary access token
2. **Copy this token** (starts with EAA...)
3. This is your `WHATSAPP_API_TOKEN` 
4. **Note**: This is temporary (24 hours) - see Step 7 for permanent token

### Step 6: Add Test Numbers
1. In API Setup, scroll to "To"
2. Add your phone number for testing (with country code)
3. You'll receive a verification code on WhatsApp
4. Enter the code to verify

### Step 7: Generate Permanent Access Token

#### Method A: Using App Settings (Quick)
1. Go to App Settings > Basic
2. Copy your **App ID**
3. Go to App Settings > Advanced > Security
4. Reset **App Secret** and copy it
5. Use this URL to generate long-lived token:
```
https://graph.facebook.com/v18.0/oauth/access_token?
grant_type=client_credentials&
client_id=YOUR_APP_ID&
client_secret=YOUR_APP_SECRET
```

#### Method B: System User (Production Recommended)
1. Go to [Business Settings](https://business.facebook.com/settings/)
2. Click "Users" > "System Users"
3. Click "Add" to create system user
4. Give permissions: "whatsapp_business_messaging"
5. Generate token - this won't expire

### Step 8: Configure Environment Variables
Update your `.env.local`:
```bash
WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

### Step 9: Test the Setup
1. Create a program in your admin panel
2. Check terminal logs for WhatsApp notifications
3. If configured correctly, you'll see "Using Meta WhatsApp Business API"

---

## Option 2: Twilio WhatsApp API (Alternative)

### Prerequisites
- A Twilio account
- Credit card for verification (free trial available)

### Step 1: Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for free account
3. Verify your email and phone number

### Step 2: Get Account Credentials
1. From Twilio Console dashboard
2. Copy your **Account SID** 
3. Copy your **Auth Token**

### Step 3: Set up WhatsApp Sandbox
1. Go to Messaging > Try it out > Send a WhatsApp message
2. Follow instructions to join sandbox
3. Send "join [sandbox-name]" to the provided number
4. Copy the **sandbox number** (like: whatsapp:+14155238886)

### Step 4: Configure Environment Variables
Update your `.env.local`:
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Step 5: Production Setup (Optional)
For production, you need:
1. A approved WhatsApp Business number
2. Complete Twilio's WhatsApp approval process
3. This can take several days/weeks

---

## Current Environment Configuration

Your current `.env.local` should look like this:

```bash
# WhatsApp notification configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Alternative WhatsApp API configuration (Meta WhatsApp Business API)
WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

## How the System Works

### Priority Order
1. **Meta API First**: If `WHATSAPP_API_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are configured
2. **Twilio Fallback**: If Meta fails or not configured, tries Twilio
3. **Console Mode**: If neither is configured, logs to terminal

### Testing Without Setup
- If no credentials are configured, the system runs in "console mode"
- All notifications are logged to the terminal
- Perfect for development and testing

## Example Real Credentials

### Meta WhatsApp Business API Example:
```bash
WHATSAPP_API_TOKEN=EAABwzLixnjYBOZBxxx...xxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=102290129340398
```

### Twilio Example:
```bash
TWILIO_ACCOUNT_SID=AC1234567890abcdef1234567890abcdef
TWILIO_AUTH_TOKEN=your_auth_token_1234567890abcdef
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## Troubleshooting

### Common Issues

#### Meta API Issues:
- **Token expires**: Generate permanent token using system user
- **Rate limiting**: Meta has strict limits (1000 messages/day free tier)
- **Phone number format**: Use format without + (e.g., 919876543210)

#### Twilio Issues:
- **Sandbox restrictions**: Only verified numbers can receive messages
- **Phone number format**: Use +91 format (e.g., +919876543210)
- **Billing**: Need to add payment method for production

#### General Issues:
- **Environment variables not loading**: Restart your development server
- **Console mode active**: Check if credentials are properly set in `.env.local`

### Debug Logs
Check terminal output for:
```
📱 [WHATSAPP] Using Meta WhatsApp Business API
📱 [WHATSAPP] Using Twilio WhatsApp API  
📱 [WHATSAPP] Console mode - credentials not configured
```

## Cost Comparison

### Meta WhatsApp Business API:
- **Free Tier**: 1,000 conversations/month
- **Paid**: $0.005-$0.009 per conversation
- **Rate Limits**: 80 messages/second (approved business)

### Twilio WhatsApp API:
- **Cost**: $0.005 per message + Twilio fees
- **No free tier** for production
- **Rate Limits**: Based on your account tier

## Production Considerations

### For Meta API:
1. Get business verification for higher limits
2. Create approved message templates
3. Set up webhooks for delivery receipts
4. Use system user for permanent tokens

### For Twilio:
1. Get approved WhatsApp Business number
2. Complete sender verification
3. Set up proper error handling
4. Monitor usage and billing

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** only
3. **Rotate tokens regularly**
4. **Monitor API usage** for unusual activity
5. **Set up proper error logging**

## Next Steps

1. Choose Meta API (recommended) or Twilio
2. Follow the setup steps for your chosen service
3. Update your `.env.local` file
4. Restart your development server
5. Test by creating a new program
6. Check terminal logs for confirmation

For production deployment, remember to set environment variables on your hosting platform!
