import dbConnect from "@/lib/mongoose";
import Messages from "@/models/Messages";
import mongoose from "mongoose";

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
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user ID" }), { status: 400 });
  }

  const messages = await Messages.aggregate([
    { $match: { receiver: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$sender",
        lastMessage: { $first: "$content" },
        timestamp: { $first: "$createdAt" },
        isRead: { $first: "$isRead" },
      },
    },
    {
      $lookup: {
        from: "registers",
        localField: "_id",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    { $unwind: "$senderInfo" },
    {
      $project: {
        _id: 0,
        senderId: "$senderInfo._id",
        name: "$senderInfo.name",
        profileImage: "$senderInfo.profileImage",
        lastMessage: 1,
        timestamp: 1,
        isRead: 1,
      },
    },
  ]);

  console.log(messages)

  return Response.json(messages);
}
