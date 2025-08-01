# Razorpay Test Keys Setup - Quick Guide

## 🚀 5-Minute Setup

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com/
2. Click "Sign Up" (Top right corner)
3. Fill in your details:
   - Business Email: (Use your email)
   - Mobile Number: (Your number)
   - Business Name: CMR_HACK (or any name)
4. Verify email and mobile

### Step 2: Access Dashboard
1. Login to https://dashboard.razorpay.com/
2. You'll see the main dashboard

### Step 3: Get Test API Keys
1. In the left sidebar, click "Account & Settings"
2. Click "API Keys" 
3. Under "Test Mode" section:
   - Click "Generate Key"
   - You'll see:
     - **Key ID**: `rzp_test_xxxxxxxxxx` (starts with rzp_test_)
     - **Key Secret**: `xxxxxxxxxxxxx` (click "Show" to reveal)

### Step 4: Copy Keys to Your Project
Replace these lines in your `.env.local` file:

```bash
# Replace these with your actual Razorpay test keys:
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
```

### Step 5: Test Payment
1. Save the `.env.local` file
2. Restart your development server: `npm run dev`
3. Go to http://localhost:3000/payments
4. Try making a test payment

## 📝 Example of Real Keys Format:
```bash
RAZORPAY_KEY_ID=rzp_test_1A2B3C4D5E6F7G
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012mnop3456
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1A2B3C4D5E6F7G
```

## 🔒 Security Notes:
- Test keys are safe to use in development
- Never share your secret key publicly
- Test keys don't process real money
- You can always regenerate keys if needed

## ⚡ Quick Commands:
After updating keys, restart the server:
```powershell
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 Current Status:
- ❌ Using placeholder keys (causing 401 error)
- ✅ Payment UI is ready
- ✅ All payment methods configured
- 🎯 Need: Real test keys from Razorpay

Once you get the real keys, your payment system will work perfectly!
