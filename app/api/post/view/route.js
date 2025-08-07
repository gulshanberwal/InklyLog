import dbConnect from "@/lib/mongoose";
import Blogs from "@/models/Blogs";

export async function PATCH(request) {
  const { slug } = await request.json();
  console.log(slug)
  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug required" }), { status: 400 });
  }

  try {
    await dbConnect();
    await Blogs.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

    return new Response(JSON.stringify({ message: "View incremented" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update view" }), { status: 500 });
  }
}
