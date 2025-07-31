import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  likes: [{
    userId: String,
    userEmail: String,
    userName: String,
    likedAt: { type: Date, default: Date.now }
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'health',
      'education',
      'infrastructure',
      'welfare',
      'employment',
      'environment',
      'housing',
      'transportation',
      'agriculture',
      'technology',
      'tourism',
      'safety',
      'other'
    ]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'active',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  budget: {
    type: Number,
    min: 0,
  },
  targetBeneficiaries: {
    type: Number,
    min: 0,
  },
  eligibilityCriteria: {
    type: String,
    maxlength: 1000,
  },
  applicationProcess: {
    type: String,
    maxlength: 1000,
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    website: String,
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  images: [{
    url: String,
    caption: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  tags: [String],
  
  // Social features
  likes: [{
    userId: String,
    userEmail: String,
    userName: String,
    likedAt: { type: Date, default: Date.now }
  }],
  dislikes: [{
    userId: String,
    userEmail: String,
    userName: String,
    dislikedAt: { type: Date, default: Date.now }
  }],
  comments: [CommentSchema],
  
  // Analytics
  likesCount: {
    type: Number,
    default: 0,
  },
  dislikesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  
  // Admin fields
  createdBy: {
    adminId: String,
    adminEmail: String,
    adminName: String,
  },
  lastUpdatedBy: {
    adminId: String,
    adminEmail: String,
    adminName: String,
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  visibility: {
    type: String,
    enum: ['public', 'draft', 'archived'],
    default: 'public',
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
ProgramSchema.index({ status: 1, visibility: 1, createdAt: -1 });
ProgramSchema.index({ category: 1, status: 1 });
ProgramSchema.index({ 'likes.userEmail': 1 });
ProgramSchema.index({ 'dislikes.userEmail': 1 });
ProgramSchema.index({ tags: 1 });
ProgramSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.models.Program || mongoose.model('Program', ProgramSchema);
