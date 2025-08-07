import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postSlug: { type: String, required: true }, // or postId if you prefer
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true },
    authorName: String,
    username: String,
    authorImage: String,
    content: { type: String, required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
