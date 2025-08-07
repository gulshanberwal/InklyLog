import Blogs from "@/models/Blogs";
import dbConnect from "@/lib/mongoose";
import { v4 as uuidv4 } from 'uuid';


export async function POST(req) {
  await dbConnect();

  function slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars (except hyphens/spaces)
      .replace(/\s+/g, '-') // replace spaces with -
      .replace(/-+/g, '-'); // collapse multiple -
  }

  const { title, subject, post, id } = await req.json();
  console.log(post)

  if (!post || typeof post !== 'object' || post.type !== 'doc') {
    return new Response(JSON.stringify({ error: 'Invalid post content' }), { status: 400 });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const slug = slugify(title) + "-" + uuidv4()

  const newBlog = await Blogs.create({
    title,
    subject,
    post,
    slug,
    authorId: id,
  });

  return new Response(JSON.stringify(newBlog), { status: 201 });
}

// 🔒 This function checks if accessed directly from browser
function isBrowserRequest(req) {
  const acceptHeader = req.headers.get("accept") || "";
  return acceptHeader.includes("text/html");
}


export async function GET(request) {

  if (isBrowserRequest(request)) {
    return new Response(
      `<h1>404 - Not Found</h1><p>This API route is not accessible from the browser.</p>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    );
  }


  await dbConnect();

  const { searchParams } = new URL(request.url);

  if (searchParams.has('authorId')) {
    const authorId = searchParams.get('authorId');

    try {
      const blogs = await Blogs.find({ authorId: authorId }).sort({ createdAt: -1 }).populate('authorId');

      return new Response(JSON.stringify(blogs), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to fetch blogs" }), { status: 500 });
    }
  }
  else {
    try {
      console.log("Fetching blogs...");

      const skip = parseInt(searchParams.get("skip") || "0");
      const limit = parseInt(searchParams.get("limit") || "6");

      const blogs = await Blogs.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('authorId');


      return new Response(JSON.stringify(blogs), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to fetch blogs" }), { status: 500 });
    }
  }
}