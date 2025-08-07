// /app/api/messages/delete/route.js
import dbConnect from "@/lib/mongoose";
import Messages from "@/models/Messages";

export async function POST(req) {
  await dbConnect();
  const { messageIds } = await req.json();

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return new Response(JSON.stringify({ error: "No message IDs provided" }), { status: 400 });
  }

  await Messages.deleteMany({ _id: { $in: messageIds } });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
