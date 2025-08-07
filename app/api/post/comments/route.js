import dbConnect from "@/lib/mongoose";
import Comments from "@/models/Comments";
import { NextResponse } from "next/server";
import Blogs from "@/models/Blogs";

export async function POST(req) {
  await dbConnect()
  const body = await req.json();

  const { postSlug, authorId, content } = body;

  if (!content || !authorId || !postSlug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newComment = await Comments.create({
      postSlug,
      authorId,
      content,
    });

    const updatedComments = await Comments.find({ postSlug }).sort({ createdAt: -1 }).populate("authorId", "name username profileImage");

    await Blogs.findOneAndUpdate(
      { slug: postSlug },
      { $inc: { comments: 1 } }
    );

    return NextResponse.json(updatedComments);

    // ✅ Increment comment count in Blog


  } catch (error) {
    return NextResponse.json({ error: "Comment failed" });
  }

}

// 🔒 This function checks if accessed directly from browser
function isBrowserRequest(req) {
  const acceptHeader = req.headers.get("accept") || "";
  return acceptHeader.includes("text/html");
}


export async function GET(req) {
  
    if (isBrowserRequest(req)) {
    return new Response(
      `<h1>404 - Not Found</h1><p>This API route is not accessible from the browser.</p>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  await dbConnect();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const comments = await Comments.find({ postSlug: slug }).sort({ createdAt: -1 }).populate("authorId", "name username profileImage");
  console.log(comments)
  return NextResponse.json(comments);
}
