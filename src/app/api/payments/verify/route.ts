import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Payment } = await import('@/models/Payment');
    
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Verify Razorpay signature
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_KEY_HERE';
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update payment status as failed
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        additionalDetails: {
          ...payment.additionalDetails,
          error: 'Payment signature verification failed',
          failedAt: new Date(),
        },
      });

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update payment status as completed
    const updatedPayment = await Payment.findByIdAndUpdate(
      payment._id,
      {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
        additionalDetails: {
          ...payment.additionalDetails,
          verifiedAt: new Date(),
          paymentMethod: 'razorpay',
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        transactionId: updatedPayment.transactionId,
        amount: updatedPayment.amount,
        status: updatedPayment.status,
        billType: updatedPayment.billType,
        billNumber: updatedPayment.billNumber,
        paidAt: updatedPayment.paidAt,
      },
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
