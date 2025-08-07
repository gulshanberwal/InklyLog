import dbConnect from "@/lib/mongoose";
import Message from "@/models/Messages";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    await dbConnect();
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
        return NextResponse.json({ error: "Missing sender or receiver ID" }, { status: 400 });
    }

    await Message.updateMany(
        { sender: senderId, receiver: receiverId, isRead: false },
        { $set: { isRead: true } }
    );


    return NextResponse.json({ success: true });
}
