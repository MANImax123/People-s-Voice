# WhatsApp Notification Feature

## Overview
This feature automatically sends WhatsApp notifications to all users whenever an admin creates a new government program. Users will receive instant notifications about new programs they might be eligible for.

## Features
- ✅ Automatic WhatsApp notifications when admin creates a program
- ✅ Manual WhatsApp notification sending for existing programs
- ✅ Bulk messaging to all users or specific phone numbers
- ✅ Console mode for development/testing
- ✅ Admin panel for managing notifications
- ✅ Support for Twilio WhatsApp API

## How It Works

### 1. Automatic Notifications
When an admin creates a new program through `/admin/programs`, the system:
1. Saves the program to the database
2. Fetches all registered users' phone numbers
3. Sends WhatsApp notifications to each user
4. Logs the notification results

### 2. Manual Notifications
Admins can send notifications for existing programs through `/admin/whatsapp`:
1. Select a program to notify about
2. Choose specific users or add custom phone numbers
3. Send bulk WhatsApp messages

## Setup Instructions

### Environment Configuration
Add these variables to your `.env.local` file:

```bash
# WhatsApp notification configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Alternative WhatsApp API configuration (if using other services)
WHATSAPP_API_TOKEN=your_whatsapp_api_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
```

### Getting Twilio Credentials
1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Set up WhatsApp sandbox or get a verified WhatsApp number
4. Use the sandbox number as `TWILIO_WHATSAPP_FROM`

### Development Mode
If Twilio credentials are not configured, the system runs in "console mode":
- Notifications are logged to the terminal
- Full message content is displayed
- No actual WhatsApp messages are sent

## File Structure

```
src/
├── lib/
│   └── whatsapp-notifications.ts    # WhatsApp service functions
├── app/
│   ├── api/
│   │   ├── programs/route.ts        # Modified to send notifications
│   │   └── whatsapp/route.ts        # Manual notification API
│   └── admin/
│       └── whatsapp/page.tsx        # Admin WhatsApp panel
└── components/
    └── whatsapp-notification-panel.tsx  # WhatsApp management UI
```

## Message Template

The WhatsApp message includes:
- Program title and category
- Program ID for reference
- Call-to-action to visit the platform
- Professional branding

Example message:
```
🎉 *New Government Program Available!*

📋 *Program:* Digital Health Initiative
🏷️ *Category:* Health
🆔 *Program ID:* 64f8b2a3c12d34e56789abcd

📝 A new government program has been launched that might benefit you!

✅ Visit our platform to:
- View complete program details
- Check eligibility criteria
- Apply if you qualify
- Get contact information

🔗 *Visit:* Your Civic Platform

Thank you for being part of our community!
*- Civic Management Team*
```

## API Endpoints

### POST `/api/whatsapp`
Send manual WhatsApp notifications
```json
{
  "programId": "64f8b2a3c12d34e56789abcd",
  "userPhoneNumbers": ["+919876543210", "+919876543211"], // Optional
  "notificationType": "new_program"
}
```

### GET `/api/whatsapp?includeUsers=true`
Get notification stats and user list
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalActivePrograms": 12,
    "whatsappConfigured": true
  },
  "users": [...]
}
```

## Navigation

### Admin Dashboard
- **Dashboard**: `/admin/dashboard` - Main admin overview
- **Programs**: `/admin/programs` - Program management
- **WhatsApp**: `/admin/whatsapp` - Notification management

### Quick Access
Navigation links are available in both:
1. Admin Dashboard header
2. Programs management page header

## Usage Examples

### Creating a Program (Automatic Notifications)
1. Go to `/admin/programs`
2. Click "New Program"
3. Fill in program details
4. Submit - WhatsApp notifications sent automatically

### Manual Notification Sending
1. Go to `/admin/whatsapp`
2. Select a program from dropdown
3. Optionally select specific users or add phone numbers
4. Click "Send WhatsApp Notifications"

## Error Handling
- If Twilio fails, fallback to console logging
- Network errors are handled gracefully
- Program creation succeeds even if notifications fail
- Detailed error logging for troubleshooting

## Phone Number Format
The system automatically formats phone numbers:
- Accepts: `9876543210`, `+919876543210`, `91-9876-543210`
- Converts to: `+919876543210` (international format)
- Defaults to India country code (+91) if not specified

## Testing

### Console Mode Testing
1. Don't configure Twilio credentials
2. Create a program or send manual notifications
3. Check terminal output for message content

### Twilio Sandbox Testing
1. Configure Twilio sandbox credentials
2. Join the sandbox with your WhatsApp number
3. Test with your phone number

## Security Considerations
- Environment variables for API credentials
- User phone numbers are protected
- No sensitive data in WhatsApp messages
- Graceful degradation when service unavailable

## Future Enhancements
- [ ] Message templates customization
- [ ] Scheduled notifications
- [ ] User preferences for notification types
- [ ] Multi-language support
- [ ] Delivery status tracking
- [ ] Integration with other messaging platforms

## Troubleshooting

### Common Issues
1. **No notifications sent**: Check Twilio credentials in `.env.local`
2. **Console mode active**: Verify environment variables are loaded
3. **Phone number errors**: Ensure numbers are in correct format
4. **API errors**: Check terminal logs for detailed error messages

### Logs Location
- Server logs: Terminal running `npm run dev`
- WhatsApp notifications: Look for `📱 [WHATSAPP]` prefixed logs
- API responses: Check browser developer tools

## Support
For questions or issues:
1. Check console logs for error messages
2. Verify environment configuration
3. Test with Twilio sandbox first
4. Refer to Twilio documentation for API-specific issues
