import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import UserModel from "@/model/user";

// Connect to MongoDB
await dbConnect();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // ?role=admin

    let query = {};
    if (role) {
      query = { role }; // filter by role if provided
    }

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
    const user = new UserModel(body);
    await user.save();

    const userObj = user.toObject();
    delete userObj.password; // remove password from response

    return NextResponse.json(userObj, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
