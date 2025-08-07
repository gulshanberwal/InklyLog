import dbConnect from "@/lib/mongoose";
import Register from "@/models/Register";

export async function PATCH(req, { params }) {
  await dbConnect();

  const { currentUserId } = await req.json(); // The user performing the follow/unfollow
  const targetUserId = params.targetUserId;

  if (!currentUserId || !targetUserId) {
    return new Response(JSON.stringify({ error: "Missing user IDs" }), { status: 400 });
  }

  try {
    const currentUser = await Register.findById(currentUserId);
    const targetUser = await Register.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    return new Response(JSON.stringify({ following: !isFollowing }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
