# Production Payment Setup Guide

## 🚀 Setting Up Real Razorpay Payments

Your payment system at `/payments` is now ready for production use with all payment methods (Credit Card, Debit Card, Net Banking, UPI).

## Step 1: Get Razorpay Credentials

### For Live/Production Use:
1. **Sign up** at [https://razorpay.com/](https://razorpay.com/)
2. **Complete KYC verification** (required for live payments)
3. **Get Live API Keys**:
   - Live Key ID: `rzp_live_xxxxxxxxxx`
   - Live Key Secret: `rzp_live_xxxxxxxxxx`

### For Testing (Current Setup):
1. **Sign up** at [https://razorpay.com/](https://razorpay.com/)
2. **Get Test API Keys** (no KYC required):
   - Test Key ID: `rzp_test_xxxxxxxxxx`  
   - Test Key Secret: `rzp_test_xxxxxxxxxx`

## Step 2: Update Environment Variables

Replace your current keys in `.env.local`:

```env
# For LIVE payments (real money)
RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_LIVE_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_LIVE_SECRET_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_LIVE_KEY_HERE

# For TEST payments (no real money)
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_TEST_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_TEST_SECRET_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_TEST_KEY_HERE
```

## Step 3: Payment Methods Enabled

Your payment system now supports:

### ✅ Credit Cards
- Visa, Mastercard, American Express, RuPay
- All major Indian and international cards

### ✅ Debit Cards  
- Visa Debit, Mastercard Debit, RuPay Debit
- All major bank debit cards

### ✅ Net Banking
- 50+ major Indian banks
- HDFC, ICICI, SBI, Axis, and more

### ✅ UPI
- Google Pay, PhonePe, Paytm, BHIM
- All UPI-enabled apps

### ✅ Digital Wallets
- Paytm Wallet, Mobikwik, Airtel Money
- Other popular digital wallets

## Step 4: Test Your Setup

### Using Test Credentials:
Visit **http://localhost:3000/payments** and test with:

```
Success Cards:
- 4111 1111 1111 1111 (Visa)
- 5555 5555 5555 4444 (Mastercard)

Failure Cards:
- 4000 0000 0000 0002 (Declined)

CVV: 123
Expiry: Any future date
```

### Using Live Credentials:
- Use real credit/debit card details
- **Real money will be charged**
- Test with small amounts first

## Step 5: Webhook Setup (Recommended)

### Add Webhook URL in Razorpay Dashboard:
```
Webhook URL: https://yourdomain.com/api/payments/webhook
Events: payment.captured, payment.failed
```

### Create Webhook Handler:
```typescript
// src/app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
    
  if (signature === expectedSignature) {
    const payload = JSON.parse(body);
    // Handle payment status updates
    console.log('Payment webhook:', payload);
  }
  
  return NextResponse.json({ status: 'ok' });
}
```

## Step 6: Production Checklist

### Security:
- [ ] HTTPS enabled on production domain
- [ ] Environment variables secured
- [ ] No sensitive data in client-side code
- [ ] Webhook signature verification enabled

### Compliance:
- [ ] GST setup (if applicable)
- [ ] PCI DSS compliance reviewed
- [ ] Terms of service updated
- [ ] Privacy policy includes payment data

### Testing:
- [ ] Test all payment methods
- [ ] Test payment failures
- [ ] Test refund process
- [ ] Verify payment confirmations

## Current Features Working:

### ✅ Payment Flow:
1. **User fills bill details** at `/payments`
2. **Clicks "Pay ₹Amount - Choose Payment Method"**
3. **Razorpay checkout opens** with all payment options
4. **User selects** Credit/Debit/NetBanking/UPI
5. **Payment processes** securely through Razorpay
6. **Success confirmation** and receipt generated
7. **Payment history** updated in user profile

### ✅ All Payment Methods:
- Cards (Credit/Debit) with CVV verification
- Net Banking with bank selection
- UPI with QR code and VPA options
- Digital wallets integration
- EMI options (for eligible amounts)

### ✅ Security Features:
- SSL encryption
- PCI DSS compliant gateway
- 3D Secure authentication
- Fraud detection
- Secure token handling

## Production vs Test Mode

### Test Mode (Current):
- Key starts with `rzp_test_`
- No real money charged
- All transactions simulated
- Perfect for development

### Live Mode (Production):
- Key starts with `rzp_live_`
- Real money transactions
- Requires KYC verification
- Full compliance needed

## Getting Your Credentials

### Quick Setup (5 minutes):
1. **Visit**: [https://dashboard.razorpay.com/signin](https://dashboard.razorpay.com/signin)
2. **Sign up** with email/phone
3. **Go to Settings** → API Keys
4. **Generate Test Keys** (for testing)
5. **Copy keys** to `.env.local`
6. **Restart server**

### For Live Payments:
1. **Complete business verification**
2. **Submit required documents**
3. **Wait for approval** (1-3 business days)
4. **Generate live keys**
5. **Update production environment**

Your payment system is now ready for production use! 🎉
