# WhatsApp Testing Checklist ✅

## Quick Setup Checklist (5 minutes)

### Phase 1: Meta Developer Setup
- [ ] Go to [developers.facebook.com](https://developers.facebook.com/)
- [ ] Create/login to Meta Developer account
- [ ] Click "Create App" → Choose "Business"
- [ ] Name your app (e.g., "CMR Test App")

### Phase 2: WhatsApp Setup
- [ ] Add WhatsApp product to your app
- [ ] Go to "Getting Started" section
- [ ] Copy **Temporary Access Token** (starts with EAA...)
- [ ] Copy **Phone Number ID** (numeric)

### Phase 3: Test Recipients
- [ ] Scroll to "Test recipients" section
- [ ] Add your phone number (+1234567890 format)
- [ ] Check WhatsApp for verification message
- [ ] Reply to accept test invitation

### Phase 4: App Configuration
- [ ] Open `.env.local` in your project
- [ ] Add these lines:
```env
WHATSAPP_API_TOKEN=your_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here
```
- [ ] Save the file

### Phase 5: Testing
- [ ] Restart development server (`npm run dev`)
- [ ] Visit `/admin/whatsapp`
- [ ] Check status shows "Meta WhatsApp Business API"
- [ ] Create test program OR use manual notification
- [ ] Check your WhatsApp for message! 🎉

## Alternative: Console Mode Testing (0 minutes)

If you want to test immediately without Meta setup:

- [ ] Keep `.env.local` without WhatsApp credentials
- [ ] Visit `/admin/whatsapp` - should show "Console Mode (Testing)"
- [ ] Create test program
- [ ] Check terminal for logged messages

## Current Status Check

Your app is currently running at: `http://localhost:3002`

Visit these URLs to check:
- **Admin WhatsApp Panel**: `http://localhost:3002/admin/whatsapp`
- **Admin Dashboard**: `http://localhost:3002/admin`

## Need Help?

Check these files in your project:
- `META_WHATSAPP_QUICK_SETUP.md` - Detailed Meta setup
- `TESTING_ENV_SETUP.md` - Environment configuration options
- `TESTING_WHATSAPP_SETUP.md` - Complete testing guide

## Pro Tips

💡 **Start with Console Mode** to test the workflow first
💡 **Use your own phone** as the test recipient
💡 **Test tokens expire in 24 hours** - easy to renew
💡 **International format required** for phone numbers (+country code)
