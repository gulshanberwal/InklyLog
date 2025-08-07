// app/profile/[authorId]/page.js
import dbConnect from "@/lib/mongoose";
import Blogs from "@/models/Blogs";
import Image from "next/image";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import Register from "@/models/Register";
import FollowButton from "@/components/utils/FollowButton";
import TabsSection from "@/components/utils/TabsSection";
import MessageCircle from "@/components/utils/MessageCircle";

export async function generateMetadata() {
  return {
    title: `User Profile`,
  };
}

export default async function ProfilePage({ params }) {
  await dbConnect();
  console.log(params.params)
  const [authorId, sessionId] = params.params || [];

  if (!mongoose.Types.ObjectId.isValid(authorId)) return notFound();


  const blogs = await Blogs.find({ authorId: authorId }).sort({ createdAt: -1 });
  const user = await Register.findById(authorId).populate("followers", "username name profileImage").populate("following", "username name profileImage").lean();

  console.log(user)
  if (!blogs || !user) return notFound();


  const cleanPosts = blogs.map((post) => ({
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    subject: post.subject,
    views: post.views,
    likes: post.likes,
    comments: post.comments,
    createdAt: post.createdAt.toString(), // or .toISOString()
    authorId: post.authorId.toString(),
  }));

  const followers = user.followers.map((f) => ({
    ...f,
    _id: f._id.toString(),
  }));

  const following = user.following.map((f) => ({
    ...f,
    _id: f._id.toString(),
  }));


  if (sessionId) {
    if (authorId == sessionId) {
      redirect("/dashboard")
    }
  }

  

  return (
    <main className="max-w-5xl mx-auto px-4 py-20 relative text-black dark:text-white">
      <div className={`flex items-center justify-between mb-4`}>
        <div className="flex items-center w-full gap-4">
          {user.profileImage && (
            <div
              className="w-14 shrink-0 self-start mt-2 h-14 rounded-full p-[2px] cursor-pointer bg-gradient-to-tr from-blue-500 via-blue-400 to-blue-900 hover:scale-105 transition"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                <Image
                  src={user.profileImage || "/default-avatar.png"}
                  alt="Profile Image"
                  width={56}
                  height={56}
                  className="w-full rounded-full h-full object-cover border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          )}

          <div className="w-full">
            <MessageCircle name={user.name} sessionId={sessionId} authorId={authorId} id={user._id.toString()}/>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            <p className="mt-1  text-gray-600 dark:text-gray-300 break-all text-sm">{user.bio}</p>
          </div>
        </div>

      </div>

      {sessionId && authorId !== sessionId && (<FollowButton targetUserId={user._id.toString()} />)}
      {/* Posts */}
      <div className=" w-full py-1 flex flex-col justify-start">
        <h1 className="text-2xl font-bold mb-4 flex">{user.name}'s Profile</h1>
        <TabsSection posts={cleanPosts} followers={followers} following={following} />
      </div>


    </main>


  );
}
