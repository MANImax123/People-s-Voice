import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  billType: {
    type: String,
    required: true,
    enum: ['property-tax', 'water-bill', 'electricity-bill', 'vehicle-tax', 'trade-license', 'building-permit', 'other']
  },
  billNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'upi', 'netbanking', 'card', 'wallet'],
    default: 'razorpay',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  transactionId: {
    type: String,
    unique: true,
  },
  dueDate: {
    type: Date,
  },
  paidAt: {
    type: Date,
  },
  receiptUrl: {
    type: String,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// Create compound index for efficient queries
PaymentSchema.index({ userEmail: 1, createdAt: -1 });
PaymentSchema.index({ billType: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
