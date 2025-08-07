import dbConnect from "@/lib/mongoose";
import Messages from "@/models/Messages";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { sender, receiver, content } = await req.json();

  if (!sender || !receiver || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const message = await Messages.create({
    sender,
    receiver,
    content,
    isRead: false,
  });

  return NextResponse.json(message);
}
