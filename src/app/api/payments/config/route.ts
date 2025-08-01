import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    
    const isConfigured = razorpayKeyId && 
                        razorpayKeySecret && 
                        razorpayKeyId !== 'rzp_test_1DP5mmOlF5G5ag' &&
                        razorpayKeySecret !== 'YOUR_SECRET_KEY_HERE' &&
                        razorpayKeySecret !== 'test_mode_secret_key_placeholder';

    const keyType = razorpayKeyId?.startsWith('rzp_live_') ? 'live' : 
                   razorpayKeyId?.startsWith('rzp_test_') ? 'test' : 'unknown';

    return NextResponse.json({
      success: true,
      configured: isConfigured,
      keyType,
      hasKeyId: !!razorpayKeyId,
      hasKeySecret: !!razorpayKeySecret,
      isPlaceholder: !isConfigured,
      keyIdPreview: razorpayKeyId ? `${razorpayKeyId.substring(0, 12)}...` : 'Not set',
      recommendations: isConfigured ? [] : [
        'Get Razorpay API keys from https://dashboard.razorpay.com/',
        'Update RAZORPAY_KEY_ID in .env.local',
        'Update RAZORPAY_KEY_SECRET in .env.local',
        'Restart the development server'
      ]
    });
  } catch (error) {
    console.error('Error checking payment configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check payment configuration' },
      { status: 500 }
    );
  }
}
