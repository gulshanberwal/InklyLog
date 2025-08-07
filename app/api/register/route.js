import { hash } from "bcryptjs";
import dbConnect from '@/lib/mongoose';
import Register from "@/models/Register";


// 🔒 This function checks if accessed directly from browser
function isBrowserRequest(req) {
  const acceptHeader = req.headers.get("accept") || "";
  return acceptHeader.includes("text/html");
}


export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();
  const name = formData.get("name");
  const username = formData.get("username");
  const password = formData.get("password");
  const bio = formData.get("bio");
  const profileImage = formData.get("profileImage"); // 🔵 new image URL

  const userExists = await Register.findOne({ username: username });
  if (userExists) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await hash(password, 10);
  const newUser = { id: Date.now().toString(), name, username, password: hashedPassword, bio, profileImage };
  await Register.create(newUser);

  return new Response(JSON.stringify({ message: "User registered" }), {
    status: 201,
  });
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
  if (searchParams.has('username')) {
    const username = searchParams.get('username');
    const users = await Register.findOne({ username: username }).populate("followers", "username name profileImage").populate("following", "username name profileImage");
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  else {
    const id = searchParams.get('id');
    const users = await Register.findById(id);
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}



export async function PATCH(req) {
  await dbConnect();

  const body = await req.json();
  const { username, name, bio, profileImage } = body;

  console.log(profileImage)
  const { searchParams } = new URL(req.url);
  const usernametoget = searchParams.get('usernametoget');
  const updatedUser = await Register.findOneAndUpdate(
    { username: usernametoget }, // 👈 using username to find
    { $set: { name, bio, username, profileImage } },
    { new: true }
  );

  if (!updatedUser) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json({ message: 'Profile updated', user: updatedUser });
}