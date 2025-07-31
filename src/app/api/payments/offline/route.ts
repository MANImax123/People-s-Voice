import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const {
      userEmail,
      userName,
      billType,
      billNumber,
      description,
      amount,
      paidDate,
      receiptNumber,
      receiptImage,
      paymentMethod
    } = await req.json();

    // Validation
    if (!userEmail || !userName || !billType || !billNumber || !description || !amount || !receiptImage) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate unique transaction ID for offline payment
    const transactionId = `OFFLINE_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create payment record
    const payment = new Payment({
      userId: userEmail, // Using email as userId for consistency
      userEmail,
      userName,
      billType,
      billNumber,
      description,
      amount: parseFloat(amount),
      status: 'completed', // Offline payments are considered completed when receipt is uploaded
      paymentMethod: 'offline',
      transactionId,
      receiptImage,
      receiptNumber: receiptNumber || '',
      paidAt: paidDate ? new Date(paidDate) : new Date(),
    });

    await payment.save();

    return NextResponse.json({
      success: true,
      message: 'Offline payment receipt uploaded successfully',
      transactionId,
      payment: {
        _id: payment._id,
        billType: payment.billType,
        billNumber: payment.billNumber,
        description: payment.description,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        receiptNumber: payment.receiptNumber,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Offline payment error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate transaction. This receipt may have already been uploaded.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save offline payment receipt' },
      { status: 500 }
    );
  }
}
