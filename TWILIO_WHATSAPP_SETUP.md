# Twilio WhatsApp Integration Setup Guide

## 🚀 Complete Setup in 10 Minutes

### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/
2. Click "Sign Up Free" (Top right corner)
3. Fill in your details:
   - Email: Your email address
   - Password: Create a strong password
   - Phone Number: Your mobile number for verification
4. Verify your email and phone number
5. Complete the welcome survey (choose "Other" for use case)

### Step 2: Access Twilio Console
1. Login to https://console.twilio.com/
2. You'll see your dashboard with Account SID displayed
3. Your account gets $15.50 trial credit for testing

### Step 3: Get Your Credentials
1. On the main dashboard, find the "Account Info" section
2. Copy these values:
   - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click "Show" to reveal, then copy

### Step 4: Set up WhatsApp Sandbox
1. In the left sidebar, go to "Messaging" → "Try it out" → "Send a WhatsApp message"
2. Or directly visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
3. You'll see the sandbox WhatsApp number: `+1 415 523 8886`
4. **Important**: To receive test messages, you need to join the sandbox:
   - Send a WhatsApp message to `+1 415 523 8886`
   - Send the message: `join <your-sandbox-name>` (e.g., `join spring-selection`)
   - You'll get a confirmation message

### Step 5: Update Your .env.local File
Replace these lines in your `.env.local`:

```bash
# Replace with your actual Twilio credentials:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Step 6: Test the Integration

#### Option A: Using API Directly
```bash
# Test single message
curl -X POST http://localhost:3001/api/whatsapp \\
  -H "Content-Type: application/json" \\
  -d '{
    "programId": "test123",
    "userPhoneNumbers": ["+91XXXXXXXXXX"]
  }'
```

#### Option B: Test via Admin Panel
1. Go to http://localhost:3001/admin
2. Add a new program
3. WhatsApp notifications will be sent automatically to all users

### Step 7: Add Test Users to Receive Messages
1. Make sure users in your database have valid phone numbers
2. Phone numbers should be in format: `+91XXXXXXXXXX` (for India)
3. Users must join the Twilio sandbox (Step 4) to receive messages

## 📱 WhatsApp Message Flow

### Current Implementation Features:
✅ **Dual API Support**: Meta WhatsApp Business API + Twilio (fallback)
✅ **Auto Notifications**: When admin adds a program, all users get WhatsApp messages
✅ **Bulk Messaging**: Send to multiple users at once
✅ **Console Fallback**: If no credentials, messages appear in console logs
✅ **Phone Format**: Auto-formats Indian phone numbers (+91)
✅ **Error Handling**: Graceful fallback if API fails

### Message Format:
```
🎉 *New Government Program Available!*

📋 *Program:* Your Program Title
🏷️ *Category:* Program Category
🆔 *Program ID:* ABC123

📝 A new government program has been launched that might benefit you!
```

## 🔧 API Endpoints

### Send WhatsApp Notification
**POST** `/api/whatsapp`
```json
{
  "programId": "program_id_here",
  "userPhoneNumbers": ["+91XXXXXXXXXX", "+91YYYYYYYYYY"],
  "notificationType": "new_program"
}
```

### Get Notification Status
**GET** `/api/whatsapp?includeUsers=true`

## 🎯 Current Status Check

### Verify Integration
1. Check your current config:
   ```bash
   curl http://localhost:3001/api/whatsapp
   ```

2. Expected response:
   ```json
   {
     "success": true,
     "stats": {
       "whatsappConfigured": true
     }
   }
   ```

## 🔒 Security & Limits

### Trial Account Limits:
- **$15.50 credit** for testing
- **WhatsApp messages**: $0.0055 per message
- **Can send ~2,800 test messages**
- **Geographic restrictions**: Some countries may be restricted

### Security Best Practices:
- Never commit credentials to git
- Use environment variables only
- Twilio credentials are safe for development
- Upgrade to paid account for production

## ⚡ Quick Commands

### Restart Server After Setup:
```powershell
# Stop current server (Ctrl+C)
npm run dev
```

### Test WhatsApp Integration:
```powershell
# Check if integration works
curl http://localhost:3001/api/whatsapp
```

## 🎉 What Happens When Admin Adds Program

1. **Admin adds program** via admin panel
2. **System fetches all users** with `role: 'user'`
3. **WhatsApp messages sent** to all users' phone numbers
4. **Fallback chain**:
   - Try Meta WhatsApp Business API first
   - If fails → Try Twilio WhatsApp
   - If fails → Log to console
5. **User receives WhatsApp** with program details

## 💡 Troubleshooting

### Twilio Console Not Loading:

1. **Alternative URLs**:
   - https://www.twilio.com/ (main site)
   - https://console.twilio.com/us1/ (US console)
   - https://www.twilio.com/console (alternative)

2. **Browser Issues**:
   - Try different browser (Chrome, Firefox, Edge)
   - Clear cache and cookies
   - Use incognito/private mode
   - Disable browser extensions

3. **Network Issues**:
   - Check if workplace/school blocks Twilio
   - Try mobile hotspot
   - Use VPN if needed

4. **Use Console Mode Instead**:
   - Keep placeholder credentials in .env.local
   - Test at http://localhost:3001/whatsapp-test
   - Messages will log to terminal (perfect for development)
   - All functionality works, just no real WhatsApp sending

### Common Issues:

1. **"Not configured" message**:
   - Check `.env.local` has correct credentials
   - Restart the server

2. **Messages not received**:
   - Join Twilio WhatsApp sandbox first
   - Check phone number format (+91XXXXXXXXXX)
   - Verify user exists in database

3. **API errors**:
   - Check Twilio account has credit
   - Verify Account SID and Auth Token are correct

4. **Console logs only**:
   - This is normal fallback mode
   - Set up credentials to enable real messaging

Your WhatsApp integration is now ready! 🚀
