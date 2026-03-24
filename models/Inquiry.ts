import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    maxlength: [100, 'Email cannot be more than 100 characters'],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be more than 20 characters'],
  },
  company: {
    type: String,
    maxlength: [100, 'Company name cannot be more than 100 characters'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a message.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
