# How to Get Razorpay Test Keys (Step-by-Step)

## 🚀 Getting Your Own Razorpay Test Keys (5 Minutes)

### Step 1: Create Razorpay Account
1. **Visit**: [https://razorpay.com/](https://razorpay.com/)
2. **Click**: "Sign Up" (top right corner)
3. **Choose**: "I'm a Developer" or "I'm a Business Owner"
4. **Fill details**:
   - Email address
   - Mobile number
   - Create password
5. **Verify**: Email and phone number

### Step 2: Access Dashboard
1. **Login** to [https://dashboard.razorpay.com/](https://dashboard.razorpay.com/)
2. **You'll see**: "Test Mode" is automatically enabled
3. **Note**: Test mode is FREE and doesn't require business verification

### Step 3: Get API Keys
1. **Go to**: Settings → API Keys (in left sidebar)
2. **OR Direct link**: [https://dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys)
3. **You'll see**:
   - Key ID: `rzp_test_xxxxxxxxxxxxxxxxx` 
   - Key Secret: `rzp_test_xxxxxxxxxxxxxxxxx` (click "Show" to reveal)
4. **Copy both keys**

### Step 4: Update Your .env.local
Replace your current placeholder keys with real test keys:

```env
# Replace these lines in your .env.local file:
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_SECRET_KEY_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
```

### Step 5: Restart Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🔍 What You'll Get

### Free Test Account Includes:
- ✅ **Unlimited test transactions**
- ✅ **All payment methods** (Cards, UPI, Net Banking)
- ✅ **Real payment flow** (but no real money)
- ✅ **Dashboard with transaction reports**
- ✅ **Webhook testing**
- ✅ **API documentation access**

### Test Cards You Can Use:
```
Successful Payments:
- 4111 1111 1111 1111 (Visa)
- 5555 5555 5555 4444 (Mastercard)
- 4000 0056 0000 0008 (Visa Debit)

Failed Payments:
- 4000 0000 0000 0002 (Generic decline)
- 4000 0000 0000 0119 (Processing error)

CVV: Any 3 digits (e.g., 123)
Expiry: Any future date (e.g., 12/25)
```

## 📱 Quick Setup Screenshots Guide

### Screenshot 1: Razorpay Homepage
- Go to razorpay.com
- Click "Sign Up" button

### Screenshot 2: Registration
- Enter email, phone, password
- Choose account type

### Screenshot 3: Dashboard
- After login, you're in "Test Mode"
- Look for "API Keys" in sidebar

### Screenshot 4: API Keys Page
- Copy Key ID (starts with rzp_test_)
- Click "Show" and copy Key Secret

## 🔒 Security Notes

### Test Mode Safety:
- ❌ **No real money charged**
- ❌ **No actual bank transactions**
- ✅ **All payments are simulated**
- ✅ **Perfect for development**
- ✅ **Free forever**

### Key Security:
- ✅ **Keep Secret Key private** (never share publicly)
- ✅ **Key ID can be public** (used in frontend)
- ✅ **Test keys are safe** (can't charge real money)

## 🎯 After Getting Keys

### 1. Test Payment Flow:
- Visit: http://localhost:3000/payments
- Fill bill details
- Use test card numbers above
- See transaction in Razorpay dashboard

### 2. Check Dashboard:
- Login to dashboard.razorpay.com
- See test transactions
- View payment reports

### 3. Verify Integration:
- Payment success/failure handling
- Receipt generation
- User payment history

## 🚀 Going Live Later (Optional)

When ready for real payments:
1. **Complete business verification** in Razorpay
2. **Submit business documents**
3. **Get live keys** (rzp_live_*)
4. **Replace test keys** with live keys
5. **Test with small real amounts**

## ⚡ Quick Commands

```bash
# Check current configuration
curl http://localhost:3000/api/payments/config

# Test payment creation (after getting real keys)
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userName": "Test User",
    "billType": "electricity", 
    "billNumber": "TEST123",
    "description": "Test Payment",
    "amount": 100
  }'
```

## 🆘 Common Issues

### "Invalid API Key" Error:
- Double-check you copied the complete key
- Ensure no extra spaces
- Verify key starts with `rzp_test_`

### "Authentication Failed":
- Make sure Secret Key is correct
- Check .env.local file syntax
- Restart development server

### Keys Not Working:
- Verify account is in Test Mode
- Check if keys are generated correctly
- Try regenerating keys in dashboard

## 💡 Pro Tips

1. **Save keys securely** - don't lose them
2. **Use test mode first** - get familiar with flow  
3. **Check dashboard regularly** - see transaction logs
4. **Test all payment methods** - cards, UPI, net banking
5. **Verify webhooks work** - for payment confirmations

Get your free Razorpay test keys now and unlock full payment functionality! 🎉
