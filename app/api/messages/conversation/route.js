import dbConnect from "@/lib/mongoose";
import Messages from "@/models/Messages";
import { NextResponse } from "next/server";

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
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }


  const messages = await Messages.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort({ createdAt: 1 })

  return NextResponse.json(messages);
}
