import mongoose from 'mongoose';

// Tech Schema
const techSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['electrical', 'plumbing', 'road-maintenance', 'street-lighting', 'waste-management', 'general-maintenance']
  },
  experience: {
    type: String,
    required: true,
    enum: ['0-1', '2-5', '5-10', '10+']
  },
  role: {
    type: String,
    default: 'tech',
    enum: ['tech', 'supervisor']
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'suspended', 'pending']
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes
techSchema.index({ email: 1 });
techSchema.index({ specialization: 1 });
techSchema.index({ status: 1 });
techSchema.index({ location: '2dsphere' });

// Pre-save middleware to update the updatedAt field
techSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
techSchema.methods.toJSON = function() {
  const tech = this.toObject();
  delete tech.password;
  return tech;
};

// Static methods
techSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

techSchema.statics.findActiveBySpecialization = function(specialization: string) {
  return this.find({ 
    specialization: specialization, 
    status: 'active' 
  }).sort({ completedTasks: -1, rating: -1 });
};

const Technician = mongoose.models.Technician || mongoose.model('Technician', techSchema);

export default Technician;
