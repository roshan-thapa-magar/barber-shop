import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import UserModel from "@/model/user";
import cloudinary from "@/lib/cloudinary";

// Connect to MongoDB
await dbConnect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // ?role=admin
    const status = searchParams.get("status");

    let query: any = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await UserModel.find(query);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { avatar, ...rest } = body;

    let avatarData = null;

    if (avatar) {
      const uploadRes = await cloudinary.uploader.upload(avatar, {
        folder: "users",
      });
      avatarData = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    const user = new UserModel({ ...rest, avatar: avatarData });
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(userObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
