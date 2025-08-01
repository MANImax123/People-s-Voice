# WhatsApp Notifications Feature

## Overview

This project includes a comprehensive WhatsApp notification system that automatically sends program notifications to users when admins create new programs. The system supports both Meta WhatsApp Business API (recommended) and Twilio WhatsApp API as fallback options.

## Features

- **Automatic Notifications**: When an admin creates a program, all users with phone numbers are automatically notified via WhatsApp
- **Manual Notifications**: Admin panel for sending custom WhatsApp notifications to selected users
- **Dual API Support**: Intelligent fallback system using Meta WhatsApp Business API (primary) and Twilio (fallback)
- **Admin Dashboard**: Dedicated WhatsApp management interface at `/admin/whatsapp`
- **Real-time Status**: Configuration status monitoring and setup guidance
- **Bulk Messaging**: Send notifications to all users or selected groups

## Quick Start

1. **Choose Your API**: 
   - Meta WhatsApp Business API (recommended - free tier available)
   - Twilio WhatsApp API (paid service)

2. **Configure Environment Variables**:
   ```env
   # Option 1: Meta WhatsApp Business API (recommended)
   WHATSAPP_API_TOKEN=your_meta_access_token
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

   # Option 2: Twilio WhatsApp API (fallback)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+1234567890
   ```

3. **Follow Setup Guide**: Check `WHATSAPP_SETUP_GUIDE.md` for detailed instructions

## API Endpoints

- `POST /api/whatsapp` - Send manual WhatsApp notifications
- `GET /api/whatsapp` - Get notification statistics and user data
- `GET /api/whatsapp/config` - Check WhatsApp configuration status
- `POST /api/programs` - Create programs (automatically triggers notifications)

## Admin Interface

Navigate to `/admin/whatsapp` to access the WhatsApp management panel:

- **Configuration Status**: View which API is active
- **User Management**: See all users with phone numbers
- **Program Selection**: Choose programs to notify users about
- **Bulk Messaging**: Send notifications to all or selected users
- **Setup Guidance**: Get help if APIs aren't configured

## How It Works

### Automatic Program Notifications

When an admin creates a program through the admin panel:

1. Program is saved to the database
2. System fetches all users with phone numbers
3. WhatsApp notifications are sent to all eligible users
4. Notification includes program title, description, and category
5. Fallback to console logging if WhatsApp APIs aren't configured

### Manual Notifications

From the admin WhatsApp panel:

1. Select a program to notify users about
2. Choose recipients (all users or specific phone numbers)
3. Optionally add a custom message
4. Send notifications through the configured API

### API Fallback System

The system tries APIs in this order:
1. **Meta WhatsApp Business API** (if configured)
2. **Twilio WhatsApp API** (if configured)
3. **Console Mode** (logs messages for development)

## Message Format

WhatsApp messages use this professional template:

```
🏛️ New City Program Alert!

📋 Program: [Program Title]
📝 Description: [Program Description]
🏷️ Category: [Program Category]

Stay informed about city programs and services!

Best regards,
City Management System
```

## Configuration Status

The system provides real-time configuration monitoring:

- ✅ **Meta API**: Shows when Meta WhatsApp Business API is configured
- ✅ **Twilio API**: Shows when Twilio WhatsApp API is configured  
- ⚠️ **Console Mode**: Shows when no APIs are configured (development mode)

## File Structure

```
src/
├── lib/
│   ├── whatsapp-notifications.ts      # Main WhatsApp service
│   ├── meta-whatsapp-notifications.ts # Meta API implementation
│   └── whatsapp-config.ts             # Configuration utilities
├── app/api/whatsapp/
│   ├── route.ts                       # Manual notification API
│   └── config/route.ts                # Configuration status API
├── components/
│   └── whatsapp-notification-panel.tsx # Admin interface
└── app/admin/whatsapp/
    └── page.tsx                       # WhatsApp admin page
```

## Troubleshooting

### Common Issues

1. **Messages Not Sending**
   - Check environment variables are set correctly
   - Verify API credentials are valid
   - Ensure phone numbers are in international format (+1234567890)

2. **Console Mode Active**
   - Add WhatsApp API credentials to `.env.local`
   - Restart the development server
   - Check the configuration status in admin panel

3. **API Errors**
   - Verify phone numbers are opted into WhatsApp Business
   - Check API rate limits and quotas
   - Review API documentation for specific error codes

### Development Mode

When no APIs are configured, the system runs in console mode:
- Messages are logged to the console instead of being sent
- All functionality works normally for testing
- No actual WhatsApp messages are sent

## Production Deployment

1. **Set Environment Variables**: Add your chosen API credentials to production environment
2. **Verify Phone Numbers**: Ensure user phone numbers are correctly formatted
3. **Test Notifications**: Create a test program to verify notifications work
4. **Monitor Usage**: Check API usage and rate limits regularly

## Security Considerations

- Store API credentials securely in environment variables
- Never commit credentials to version control
- Use webhook verification for production Meta API setup
- Implement rate limiting for bulk messaging
- Validate phone numbers before sending messages

## Future Enhancements

- WhatsApp message templates for different program types
- Scheduled notifications for program reminders
- User preferences for notification opt-in/opt-out
- Message delivery status tracking
- WhatsApp bot integration for two-way communication

## Support

For detailed setup instructions, see `WHATSAPP_SETUP_GUIDE.md`.
For API documentation, refer to:
- [Meta WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
