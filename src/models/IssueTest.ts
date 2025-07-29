import mongoose from 'mongoose';

// Test Issue model with moderate complexity
const IssueTestSchema = new mongoose.Schema({
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
  status: {
    type: String,
    default: 'reported',
    enum: ['reported', 'acknowledged', 'in-progress', 'resolved', 'closed']
  },
  // Add simple nested object
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
    }
  }
}, {
  timestamps: true
});

const IssueTest = mongoose.models.IssueTest || mongoose.model('IssueTest', IssueTestSchema);

export default IssueTest;
