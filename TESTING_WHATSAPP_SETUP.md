# WhatsApp Testing Setup Guide

## For Testing Purpose Only

This guide helps you set up WhatsApp notifications for **testing and development** purposes using free/trial options.

## Option 1: Meta WhatsApp Business API (Recommended for Testing)

### Why Meta API for Testing?
- ✅ **Free Tier Available** - No cost for basic testing
- ✅ **Easy Setup** - Quick to get started
- ✅ **No Phone Number Purchase** - Use your existing number
- ✅ **Good for Development** - Perfect for testing workflows

### Quick Testing Setup

#### Step 1: Create Meta Developer Account (Free)
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a free developer account
3. Verify your account with phone/email

#### Step 2: Create Test App
1. Click "Create App" → Choose "Business" type
2. Name it something like "CMR Test App"
3. Add WhatsApp product to your app

#### Step 3: Get Test Credentials
1. In WhatsApp → Getting Started
2. You'll see a temporary access token (valid for 24 hours)
3. Note the Test Phone Number ID provided

#### Step 4: Add to Your .env.local
```env
# Meta WhatsApp API for Testing
WHATSAPP_API_TOKEN=your_temporary_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_test_phone_number_id_here
```

#### Step 5: Add Test Recipients
1. In Meta Developer Console → WhatsApp → Getting Started
2. Add phone numbers to "Test recipients"
3. Include your own phone number for testing
4. Recipients must accept the test invitation

### Testing Flow
1. Add test phone numbers in Meta console
2. Restart your Next.js server
3. Go to `/admin/whatsapp` - should show "Meta WhatsApp Business API" status
4. Create a test program or use manual notification
5. Check your WhatsApp for the test message!

## Option 2: Twilio Trial (Alternative for Testing)

### Why Twilio for Testing?
- ✅ **Free Trial Credit** - $15 free credit
- ✅ **Easy Setup** - Simple registration
- ✅ **Good Documentation** - Clear testing guides

### Quick Twilio Setup
1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get free trial account ($15 credit)
3. Go to WhatsApp Sandbox for testing
4. Follow sandbox setup instructions

### Twilio Test Credentials
```env
# Twilio WhatsApp API for Testing
TWILIO_ACCOUNT_SID=your_trial_account_sid
TWILIO_AUTH_TOKEN=your_trial_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## Option 3: Console Mode (No API Setup)

If you just want to test the functionality without actual WhatsApp messages:

1. **Don't add any API credentials** to `.env.local`
2. The system will automatically run in **Console Mode**
3. All "messages" will be logged to the terminal instead
4. Perfect for testing the workflow without sending real messages

### Console Mode Benefits
- ✅ **Zero Setup** - Works immediately
- ✅ **No API Limits** - Test unlimited messages
- ✅ **Safe Testing** - No accidental real messages
- ✅ **Fast Development** - See output instantly in terminal

## Recommended Testing Approach

### Phase 1: Console Mode Testing
```env
# No WhatsApp credentials - runs in console mode
# Just test the workflow
```

### Phase 2: Meta API Testing
```env
# Add Meta credentials for real WhatsApp testing
WHATSAPP_API_TOKEN=your_meta_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
```

### Phase 3: Production Ready
- Upgrade Meta API to production access
- Or switch to paid Twilio account

## Testing Checklist

### ✅ Console Mode Test
- [ ] Create a program in admin panel
- [ ] Check terminal for WhatsApp message logs
- [ ] Use manual notification in `/admin/whatsapp`
- [ ] Verify all users are processed

### ✅ Real WhatsApp Test (Meta API)
- [ ] Set up Meta developer account
- [ ] Add test phone numbers
- [ ] Configure `.env.local` with Meta credentials
- [ ] Test automatic program notifications
- [ ] Test manual notifications
- [ ] Verify message format and content

## Troubleshooting Testing Issues

### Console Mode Not Working?
- Check terminal output when creating programs
- Look for "Console Mode" status in `/admin/whatsapp`
- Ensure no API credentials are in `.env.local`

### Meta API Issues?
- Check if access token expired (24-hour limit)
- Verify test recipients are added in Meta console
- Ensure phone numbers are in international format (+1234567890)
- Check Meta developer console for error messages

### Phone Number Format
```javascript
// Correct formats for testing
+1234567890    // US number
+911234567890  // India number
+44123456789   // UK number
```

## Quick Start for Testing

1. **Immediate Testing** (Console Mode):
   ```bash
   # No setup needed - just run the app
   npm run dev
   ```

2. **Real WhatsApp Testing** (5 minutes setup):
   ```bash
   # 1. Get Meta developer account
   # 2. Create test app
   # 3. Add credentials to .env.local
   # 4. Add test recipients
   # 5. Restart server and test!
   ```

## Development Tips

- **Start with Console Mode** - Test the workflow first
- **Use Your Own Number** - Add yourself as test recipient
- **Check Browser Console** - Look for any API errors
- **Monitor Terminal** - Watch for message processing logs
- **Test Incrementally** - Start with one user, then bulk

## Cost for Testing

- **Console Mode**: Free ✅
- **Meta API (Testing)**: Free ✅  
- **Twilio Trial**: $15 free credit ✅
- **Production**: Varies by usage

Perfect for testing without any business setup or significant costs!
