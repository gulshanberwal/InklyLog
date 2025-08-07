import dbConnect from "@/lib/mongoose";
import Register from "@/models/Register";


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
  try {
    const id = searchParams.get('id');
  const users = await Register.findById(id).populate("followers", "username name profileImage").populate("following", "username name profileImage")

  console.log({followers: users.followers})
  return new Response(JSON.stringify({ users: users }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}