import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/mongodb';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag', // Test key
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET_KEY_HERE', // Add your secret key
});

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Payment } = await import('@/models/Payment');
    
    const body = await request.json();
    const {
      userEmail,
      userName,
      billType,
      billNumber,
      description,
      amount,
      dueDate,
      additionalDetails
    } = body;

    // Validate required fields
    if (!userEmail || !userName || !billType || !billNumber || !description || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 1000000) { // Max 10 lakh INR
      return NextResponse.json(
        { error: 'Invalid amount. Must be between ₹1 and ₹10,00,000' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paisa
      currency: 'INR',
      receipt: transactionId,
      notes: {
        billType,
        billNumber,
        userEmail,
        userName,
      },
    });

    // Save payment record to database
    const payment = new Payment({
      userId: userEmail, // Using email as user ID for now
      userEmail,
      userName,
      billType,
      billNumber,
      description,
      amount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      transactionId,
      dueDate: dueDate ? new Date(dueDate) : null,
      additionalDetails: additionalDetails || {},
    });

    await payment.save();

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      transactionId,
      paymentId: payment._id,
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { default: Payment } = await import('@/models/Payment');
    
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('userEmail');
    const status = searchParams.get('status');
    const billType = searchParams.get('billType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    // Build filter
    const filter: any = { userEmail };
    if (status) filter.status = status;
    if (billType) filter.billType = billType;

    // Get payments with pagination
    const skip = (page - 1) * limit;
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments(filter);

    return NextResponse.json({
      success: true,
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
