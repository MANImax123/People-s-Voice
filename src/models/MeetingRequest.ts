import mongoose from 'mongoose';

export interface IMeetingRequest extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  userPhone: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'cancelled';
  adminResponse?: string;
  adminId?: mongoose.Types.ObjectId;
  approvedDate?: Date;
  
  // User scheduling details (filled after approval)
  selectedDate?: Date;
  selectedTime?: string;
  meetingDescription?: string;
  
  // Meeting details
  meetingType: 'general' | 'complaint' | 'suggestion' | 'project_proposal' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const meetingRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminResponse: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedDate: {
    type: Date
  },
  selectedDate: {
    type: Date
  },
  selectedTime: {
    type: String
  },
  meetingDescription: {
    type: String,
    maxlength: 1000
  },
  meetingType: {
    type: String,
    enum: ['general', 'complaint', 'suggestion', 'project_proposal', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
meetingRequestSchema.index({ userId: 1, status: 1 });
meetingRequestSchema.index({ status: 1, requestDate: -1 });
meetingRequestSchema.index({ selectedDate: 1, status: 1 });

const MeetingRequest = mongoose.models.MeetingRequest || mongoose.model<IMeetingRequest>('MeetingRequest', meetingRequestSchema);

export default MeetingRequest;
