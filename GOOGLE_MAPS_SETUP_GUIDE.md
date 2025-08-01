# 🗺️ Google Maps API Setup Guide for Civic Issue Reporting

## Overview
This guide will help you set up Google Maps API to enable interactive location picking for civic issue reporting.

## Prerequisites
- Google Cloud Platform account
- Credit card (for API verification - free tier available)
- Project administrator access

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing project
3. **Enable billing** (required even for free tier)

## Step 2: Enable Required APIs

1. **Go to APIs & Services** → **Library**
2. **Enable the following APIs:**
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for search functionality)

## Step 3: Create API Key

1. **Go to APIs & Services** → **Credentials**
2. **Click "Create Credentials"** → **API Key**
3. **Copy the generated API key**

## Step 4: Secure Your API Key

### Option A: Restrict by HTTP Referrers (Recommended for Development)
```
http://localhost:3000/*
http://localhost:3001/*
https://yourdomain.com/*
```

### Option B: Restrict by IP Addresses (For Production)
Add your server IP addresses

### Option C: Restrict by API
- Maps JavaScript API
- Geocoding API
- Places API

## Step 5: Add API Key to Environment

1. **Open your `.env.local` file**
2. **Add the API key:**
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. **Restart your development server:**
```bash
npm run dev
```

## Step 6: Test the Integration

1. **Go to Report Issue page**: http://localhost:3000/report-issue
2. **Click "📍 Use Map" button**
3. **Verify map loads correctly**
4. **Test location selection and search**

## Features Enabled

### 🗺️ Interactive Map
- Click anywhere to select location
- Drag marker to fine-tune position
- Zoom and pan for precise positioning

### 📍 GPS Location
- "Use Current Location" button
- Automatic coordinates capture
- Real-time address resolution

### 🔍 Location Search
- Search for places, addresses, landmarks
- Auto-complete suggestions
- Real-time results

### 📊 Data Captured
- Latitude and longitude coordinates
- Formatted address
- Location accuracy
- Timestamp of selection

## Pricing Information

### Free Tier (Monthly)
- **Maps JavaScript API**: 28,000 loads
- **Geocoding API**: 40,000 requests
- **Places API**: 17,000 requests

### Estimated Usage
- **Small municipality** (100 reports/month): FREE
- **Medium city** (1000 reports/month): ~$5-10/month
- **Large city** (5000+ reports/month): ~$25-50/month

## Troubleshooting

### Map Not Loading
1. **Check API key** in browser console
2. **Verify APIs are enabled** in Google Cloud Console
3. **Check domain restrictions** in API key settings
4. **Ensure billing is enabled** on Google Cloud Project

### Location Search Not Working
1. **Enable Places API** in Google Cloud Console
2. **Add Places API** to API key restrictions
3. **Check quota limits** in Google Cloud Console

### "For development purposes only" Watermark
1. **Add billing information** to Google Cloud Project
2. **Remove IP/referrer restrictions** temporarily for testing
3. **Verify API key** has proper permissions

## Security Best Practices

### 🔒 Production Security
1. **Use HTTPS only** for production deployments
2. **Restrict API key** to specific domains/IPs
3. **Monitor usage** regularly in Google Cloud Console
4. **Set up billing alerts** to prevent unexpected charges

### 🚫 What NOT to Do
- Don't expose API key in client-side code (use NEXT_PUBLIC_ prefix)
- Don't use unrestricted API keys in production
- Don't ignore billing alerts
- Don't share API keys in version control

## Alternative Solutions

### If Google Maps is Not Available
1. **OpenStreetMap** with Leaflet.js (Free)
2. **Mapbox** (Free tier available)
3. **Manual coordinates entry** (backup option)
4. **Plus code** input field

## Support

### Getting Help
- **Google Cloud Support**: For API/billing issues
- **Stack Overflow**: For implementation questions
- **Project Documentation**: For platform-specific help

### Common Error Codes
- **INVALID_REQUEST**: Check API key format
- **REQUEST_DENIED**: Check API restrictions
- **OVER_QUERY_LIMIT**: Check quota usage
- **ZERO_RESULTS**: Location not found

## Testing Checklist

- [ ] ✅ Map loads without errors
- [ ] ✅ Location search works
- [ ] ✅ Marker can be dragged
- [ ] ✅ Current location button works
- [ ] ✅ Address is automatically filled
- [ ] ✅ Coordinates are captured
- [ ] ✅ Form submission includes location data
- [ ] ✅ Manual entry still works as fallback

## Benefits for Citizens

### 🎯 Precise Reporting
- Exact GPS coordinates ensure proper routing
- Reduces misplaced issue reports
- Faster response from field teams

### 📱 Mobile-Friendly
- Touch interface for mobile users
- GPS integration for smartphones
- Offline fallback options

### 🚀 Improved Experience
- Visual location selection
- Real-time validation
- Professional interface

---

**Next Steps:** After successful setup, test the feature thoroughly and train your staff on the new location selection capabilities.
