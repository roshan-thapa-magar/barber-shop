import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import UserModel from "@/model/user";

await dbConnect();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const user = await UserModel.findById(id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update fields
    Object.assign(user, body);

    // Save triggers pre("save") to hash password if modified
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
