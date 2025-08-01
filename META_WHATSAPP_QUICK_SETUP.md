# Meta WhatsApp API - Quick Testing Setup (5 Minutes)

## What You Need
- Meta Developer Account (free)
- Your phone number for testing
- 5 minutes of time

## Step-by-Step Setup

### Step 1: Create Meta Developer Account
1. **Go to**: [https://developers.facebook.com/](https://developers.facebook.com/)
2. **Click**: "Get Started" (top right)
3. **Sign in** with your Facebook account or create one
4. **Verify** your developer account (phone/email)

### Step 2: Create a Test App
1. **Click**: "Create App" button
2. **Select**: "Business" as app type
3. **App Name**: "CMR Test App" (or any name you like)
4. **Contact Email**: Your email
5. **Click**: "Create App"

### Step 3: Add WhatsApp to Your App
1. **Find**: "WhatsApp" in the products list
2. **Click**: "Set up" button next to WhatsApp
3. You'll be taken to WhatsApp setup page

### Step 4: Get Your Test Credentials
1. **Look for**: "Getting Started" section on the left sidebar
2. You'll see a section called **"Send messages"**
3. **Copy these two values**:
   - **Temporary Access Token** (starts with EAA...)
   - **Phone Number ID** (numeric ID)

### Step 5: Add Test Recipients
1. **Scroll down** to "Test recipients" section
2. **Click**: "Add recipient"
3. **Enter your phone number** in international format (+1234567890)
4. **Click**: "Add"
5. **Check your WhatsApp** - you'll get a verification message
6. **Reply** to accept the test invitation

### Step 6: Configure Your App
1. **Open**: `c:\Users\manit\OneDrive\Desktop\CMR_HACK\.env.local`
2. **Add these lines**:
```env
# Meta WhatsApp API for Testing
WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=1234567890123456
```
3. **Replace** the values with what you copied from Step 4
4. **Save** the file

### Step 7: Restart and Test
1. **Stop** your development server (Ctrl+C in terminal)
2. **Start** it again:
```bash
npm run dev
```
3. **Visit**: http://localhost:3002/admin/whatsapp
4. **Should show**: "Meta WhatsApp Business API" status

### Step 8: Send Test Message
1. **Create a test program** in admin panel, OR
2. **Use manual notification** in `/admin/whatsapp`
3. **Check your WhatsApp** for the message!

## Important Notes

### ⏰ Test Token Expires
- The temporary access token lasts **24 hours**
- After that, get a new one from the same place
- For longer testing, you can create a permanent token

### 📱 Phone Number Format
- Always use international format: `+1234567890`
- Include country code
- No spaces or dashes

### 🧪 Test Recipients Only
- Messages only go to phones you added as test recipients
- Perfect for safe testing
- No risk of spamming real users

## Quick Test Commands

```bash
# Check if Meta API is working
curl -X GET "https://graph.facebook.com/v20.0/YOUR_PHONE_NUMBER_ID?access_token=YOUR_ACCESS_TOKEN"

# Should return phone number details if working
```

## Troubleshooting

### "Invalid Access Token"
- Token might be expired (24 hours)
- Get a new token from Meta Developer Console
- Make sure you copied the full token

### "Phone Number Not Found"
- Check you're using the correct Phone Number ID
- Verify the phone number is added as test recipient
- Make sure recipient accepted the test invitation

### Still Showing "Console Mode"
- Check `.env.local` has the correct variable names
- Restart the development server
- Check for typos in the environment variables

## What's Next?

Once this is working:
1. **Test automatic notifications** by creating programs
2. **Test manual notifications** from admin panel
3. **Add more test recipients** if needed
4. **Explore message customization**

This gives you a fully functional WhatsApp testing environment in under 5 minutes!
