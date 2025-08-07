import dbConnect from "@/lib/mongoose";
import Register from "@/models/Register";

export async function POST(req) {
  await dbConnect();

  const { currentUserId, targetUserId } = await req.json();

  const currentUser = await Register.findById(currentUserId);

  if (!currentUser) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  const isFollowing = currentUser.following.includes(targetUserId);

  return new Response(JSON.stringify({ isFollowing }), { status: 200 });
}
