# Production Deployment Guide

## Vercel Deployment Setup (FIXED)

### ⚠️ Important: Simplified Configuration
The `vercel.json` has been simplified to avoid conflicts with Next.js auto-detection.

### 1. Environment Variables for Production
Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Database (Production)
MONGODB_URI=mongodb+srv://Maniteja:Maniteja%40123@cluster0.lcffebf.mongodb.net/civic-platform?retryWrites=true&w=majority&appName=Cluster0

# Authentication & Security
NEXTAUTH_SECRET=a8f5e9d7b2c4h6j8k1m3n5p7q9r2s4t6u8v1w3x5y7z9a1b2c3d4e5f6g7h8
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
GOOGLE_CLIENT_SECRET=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

# Google Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC0ZTzl2U_xHsAbYT_0XwhJM8vxi271qIQ
GEMINI_API_KEY=AIzaSyAKplXrOh-vuCxLIhtc3aDGZF190MfkCjc

# Email Services
EMAIL_USER=lenkalapellymaniteja142@gmail.com
EMAIL_PASS=mcwyktomscppvmhf
RESEND_API_KEY=re_T7SU2rFw_8agf3C15ps5J4pJUqshaXMMu

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_zaO7GSm58PEfcY
RAZORPAY_KEY_SECRET=yjwv3XN9sHQW5mihwDaQH4PO
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_zaO7GSm58PEfcY

# Application Settings
NODE_ENV=production
PAYMENT_MODE=production
```

### 2. Fixed Configuration Issues
✅ **Removed conflicting properties**: No `builds` + `functions` conflict  
✅ **Removed routes**: Let Next.js handle routing automatically  
✅ **Simplified vercel.json**: Only essential configuration  
✅ **Correct function paths**: `src/app/api/**/*.ts` pattern  
✅ **Fixed npm cache issues**: Added force install and cache bypass  
✅ **Node.js version pinned**: Ensures consistent builds  

### 3. NPM Cache Fix Applied
- **Custom install command**: `npm ci --force --no-audit --no-fund`
- **Node.js version**: Pinned to >=18.17.0
- **Cache bypass**: `.npmrc` configured to prevent cache corruption

#### Option A: Use Vercel Pro (Custom Domain)
1. Purchase domain from any provider
2. Add domain in Vercel Dashboard
3. Configure DNS records
4. Your link becomes: `https://yourdomain.com`

#### Option B: Use Vercel's Stable URL
1. Set project name to: `peoples-voice`
2. Your stable URL: `https://peoples-voice-username.vercel.app`

### 3. Deployment Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 4. Git Branch Configuration
- **Production Branch**: `main` (current)
- **Preview Branches**: All other branches
- **Auto-Deploy**: Enabled for main branch

### 5. Performance Optimizations
- **Edge Functions**: Enabled
- **Analytics**: Enable for monitoring
- **Speed Insights**: Enable for performance tracking

## Important Notes

1. **Environment Variables**: Must be set in Vercel Dashboard
2. **Domain Stability**: Use custom domain or consistent project naming
3. **Branch Protection**: Only deploy from main branch for production
4. **Database**: MongoDB Atlas is already cloud-ready
5. **API Keys**: All keys are production-ready

## Deployment Steps

1. Push code to GitHub main branch
2. Connect repository to Vercel
3. Add environment variables in Vercel
4. Deploy from main branch
5. Configure custom domain (optional)

Your deployment URL will remain stable as long as:
- Project name doesn't change
- Deploying from main branch
- Account remains active
