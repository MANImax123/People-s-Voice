import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'super-admin'],
  },
  department: {
    type: String,
    enum: ['general', 'infrastructure', 'utilities', 'public-safety', 'environment'],
    default: 'general',
  },
  permissions: {
    assignIssues: {
      type: Boolean,
      default: true,
    },
    manageTechs: {
      type: Boolean,
      default: true,
    },
    viewReports: {
      type: Boolean,
      default: true,
    },
    managePayments: {
      type: Boolean,
      default: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1, isActive: 1 });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
