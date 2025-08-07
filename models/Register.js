
import mongoose from 'mongoose';

const RegisterSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  bio: { type: String, default: "" },
  profileImage: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Register' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Register' }],
}, { timestamps: true });

export default mongoose.models.Register || mongoose.model('Register', RegisterSchema);
