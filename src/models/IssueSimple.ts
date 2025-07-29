import mongoose from 'mongoose';

// Simplified Issue model to test schema complexity
const IssueSimpleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'reported'
  }
}, {
  timestamps: true
});

const IssueSimple = mongoose.models.IssueSimple || mongoose.model('IssueSimple', IssueSimpleSchema);

export default IssueSimple;
