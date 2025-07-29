import mongoose from 'mongoose';

// Test Issue model with references and indexes
const IssueFullSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'street-lights',
      'potholes',
      'garbage-collection',
      'water-leakage',
      'sewage-overflow',
      'road-maintenance',
      'traffic-signals',
      'public-toilets',
      'park-maintenance',
      'noise-pollution',
      'illegal-construction',
      'other'
    ]
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  aiAnalysis: {
    priorityReason: {
      type: String,
      required: true
    },
    severityFactors: [{
      factor: String,
      impact: String,
      score: Number
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  status: {
    type: String,
    default: 'reported',
    enum: ['reported', 'acknowledged', 'in-progress', 'resolved', 'closed']
  },
  location: {
    metropolitanCity: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    exactAddress: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    }
  },
  photos: [{
    data: {
      type: String, // Base64 encoded image data
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reportedBy: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  // Add the references - this might be the issue
  assignedTo: {
    techId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tech',
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    }
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  estimatedResolutionTime: {
    type: String,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  },
  citizenFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    comment: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Add indexes - this might be the issue
IssueFullSchema.index({ 'location.metropolitanCity': 1 });
IssueFullSchema.index({ 'location.area': 1 });
IssueFullSchema.index({ category: 1 });
IssueFullSchema.index({ status: 1 });
IssueFullSchema.index({ priority: 1 });
IssueFullSchema.index({ createdAt: -1 });
IssueFullSchema.index({ 'location.coordinates': '2dsphere' });

const IssueFull = mongoose.models.IssueFull || mongoose.model('IssueFull', IssueFullSchema);

export default IssueFull;
