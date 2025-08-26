import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import UserModel from "@/model/user";
import cloudinary from "@/lib/cloudinary";

await dbConnect();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await UserModel.findById(id).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { avatar, ...rest } = body;

    const user = await UserModel.findById(id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // If new avatar uploaded, delete old one and upload new
    if (avatar) {
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      const uploadRes = await cloudinary.uploader.upload(avatar, {
        folder: "users",
      });
      user.avatar = {
        url: uploadRes.secure_url,
        public_id: uploadRes.public_id,
      };
    }

    Object.assign(user, rest);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json(userObj, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
