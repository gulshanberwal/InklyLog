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

  const users = await Register.find({}, 'username name profileImage _id').lean();
  if (!users){
    return new Response(JSON.stringify({error: "There are no users"}))
  }
  return new Response(JSON.stringify(users))
  
}


