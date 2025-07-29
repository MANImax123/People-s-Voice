import mongoose from 'mongoose';

// Test Issue model with complex nested objects
const IssueComplexSchema = new mongoose.Schema({
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
  // Add AI analysis object
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
    // Add coordinates - this might be the issue
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
  // Add photos array
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
  }]
}, {
  timestamps: true
});

const IssueComplex = mongoose.models.IssueComplex || mongoose.model('IssueComplex', IssueComplexSchema);

export default IssueComplex;
