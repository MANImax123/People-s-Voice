import mongoose from 'mongoose';

// Simple test to verify mongoose model creation works
const TestSchema = new mongoose.Schema({
  title: String,
  description: String
});

const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

export default TestModel;
