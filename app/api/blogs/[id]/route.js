import dbConnect from "@/lib/mongoose"
import Blogs from "@/models/Blogs"

export async function PATCH(req, { params }) {
  await dbConnect();
  const { title, subject, post, id: userId } = await req.json();
  console.log(userId)
  const updated = await Blogs.findOneAndUpdate(
    { _id: params.id, authorId: userId }, // optional: restrict to author's own post
    {
      title,
      subject,
      post: post,
    },
    { new: true }
  );

  return Response.json(updated);
}

export async function GET(req, { params }) {
  await dbConnect()
  const blog = await Blogs.findById(params.id)
  console.log(blog)
  return Response.json(blog)
}


export async function DELETE(req, { params }) {
  await dbConnect();
  
  try {
    const deleted = await Blogs.findByIdAndDelete(params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Post not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}