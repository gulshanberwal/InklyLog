// /app/api/posts/like/route.js (or .ts)
import dbConnect from "@/lib/mongoose";
import Blogs from "@/models/Blogs";


export async function PATCH(req) {

  try {
    await dbConnect();

    const { slug, action } = await req.json();
    console.log(slug, action)
    const blog = await Blogs.findOne({ slug });
    if (!blog) return new Response("Blog not found", { status: 404 });

    blog.likes += action === "like" ? 1 : -1;
    if (blog.likes < 0) blog.likes = 0;

    await blog.save();
    return new Response(JSON.stringify({ likes: blog.likes }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to update Likes" }), { status: 500 });
  }
}
