import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug.'],
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt.'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content.'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name.'],
    default: 'NTS Admin',
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    default: 'Technology',
  },
  image: {
    type: String, // URL or base64
    required: [true, 'Please provide a featured image URL.'],
  },
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Published',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
