
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: String,
  post: { type: Object, required: true },
  subject: String,
  content: String,
  slug: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Register', required: true }, // Reference to users._id
  views: {type: Number, default: 0},
  likes: {type: Number, default: 0},
  comments: {type: Number, default: 0},
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);