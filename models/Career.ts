import mongoose from 'mongoose';

const CareerSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Please provide the job title applied for.'],
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name.'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    maxlength: [100, 'Email cannot be more than 100 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    maxlength: [20, 'Phone number cannot be more than 20 characters'],
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters'],
  },
  experience: {
    type: String,
    required: [true, 'Please provide your experience level.'],
  },
  linkedin: {
    type: String,
    maxlength: [200, 'LinkedIn URL cannot be more than 200 characters'],
  },
  resumePath: {
    type: String,
    required: [true, 'Resume file path is required.'],
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Career || mongoose.model('Career', CareerSchema);
