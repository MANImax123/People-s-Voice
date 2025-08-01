# Quick Testing Setup - .env.local Configuration

## For Testing Purpose Only

Choose one of these configurations based on your testing needs:

## Option 1: Console Mode Testing (Instant - No Setup Required)

**Perfect for testing the workflow without sending real WhatsApp messages.**

```env
# .env.local - Console Mode (No WhatsApp credentials needed)
# Just make sure these WhatsApp variables are NOT set or commented out:

# WHATSAPP_API_TOKEN=
# WHATSAPP_PHONE_NUMBER_ID=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_WHATSAPP_FROM=

# Your other existing variables (MongoDB, etc.)
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

**What happens**: All WhatsApp messages are logged to the terminal console instead of being sent. Perfect for testing!

---

## Option 2: Meta WhatsApp API Testing (5-minute setup)

**For real WhatsApp message testing with free Meta API.**

### Quick Steps:
1. Go to [Meta for Developers](https://developers.facebook.com/) (free account)
2. Create a new app → Add WhatsApp product
3. In WhatsApp → Getting Started, you'll see:
   - Temporary access token (24 hours)
   - Test phone number ID
4. Add test recipients (your phone number)

```env
# .env.local - Meta WhatsApp API Testing
WHATSAPP_API_TOKEN=your_24_hour_test_token_from_meta
WHATSAPP_PHONE_NUMBER_ID=your_test_phone_number_id_from_meta

# Your other existing variables
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

**What happens**: Real WhatsApp messages sent to test recipients only.

---

## Option 3: Twilio Trial Testing (Alternative)

**For real WhatsApp testing using Twilio's free trial.**

### Quick Steps:
1. Sign up at [Twilio](https://www.twilio.com/try-twilio) (free trial)
2. Go to WhatsApp Sandbox
3. Follow sandbox setup instructions

```env
# .env.local - Twilio WhatsApp API Testing
TWILIO_ACCOUNT_SID=your_trial_account_sid
TWILIO_AUTH_TOKEN=your_trial_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Your other existing variables
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

**What happens**: Real WhatsApp messages sent using Twilio sandbox.

---

## Testing Instructions

### After Setting Up Environment:

1. **Save your .env.local file**
2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Check Configuration Status**:
   - Visit `http://localhost:3002/admin/whatsapp`
   - You should see one of:
     - "Console Mode" (Option 1)
     - "Meta WhatsApp Business API" (Option 2)
     - "Twilio WhatsApp API" (Option 3)

4. **Test Automatic Notifications**:
   - Go to admin panel
   - Create a test program
   - Check your WhatsApp (Options 2&3) or terminal console (Option 1)

5. **Test Manual Notifications**:
   - Visit `/admin/whatsapp`
   - Select a program
   - Send test notification

## Quick Verification

### Console Mode (Option 1):
```bash
# After creating a program, check terminal output:
# You should see messages like:
[WhatsApp Console] Sending to +1234567890: 🏛️ New City Program Alert! ...
```

### Real WhatsApp (Options 2&3):
- Check your WhatsApp for actual messages
- Message format: "🏛️ New City Program Alert! ..."

## Troubleshooting

### "Console Mode" showing when you want real WhatsApp?
- Double-check your .env.local has the correct API credentials
- Restart the development server
- Check for typos in environment variable names

### No messages at all?
- Check terminal for error logs
- Verify users in your database have phone numbers
- Ensure phone numbers are in international format (+1234567890)

### Meta API "Token Expired"?
- Test tokens expire after 24 hours
- Get a new temporary token from Meta Developer Console
- For longer testing, set up permanent access token

## Recommended for Testing

**Start with Option 1 (Console Mode)** to test the workflow, then move to **Option 2 (Meta API)** for real WhatsApp testing.

Both are completely free and perfect for development/testing purposes!
