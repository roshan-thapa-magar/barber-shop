import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import UserModel from "@/model/user";
import cloudinary from "@/lib/cloudinary";

await dbConnect();

type IUser = {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "user" | "customer";
  status?: "active" | "inactive";
  avatar?: { url: string; public_id: string };
  [key: string]: unknown; // replace any with unknown
};

// Cloudinary upload response type
type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unknown error occurred";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const query: Partial<IUser> = {};
    if (role) query.role = role as IUser["role"];
    if (status) query.status = status as IUser["status"];

    const users = await UserModel.find(query);
    return NextResponse.json(users, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Partial<IUser> & { avatar?: string; password?: string } =
      await request.json();
    const { avatar, ...rest } = body;

    let avatarData: IUser["avatar"] | undefined = undefined;

    if (avatar) {
      const uploadRes: CloudinaryUploadResponse =
        await cloudinary.uploader.upload(avatar, { folder: "users" });
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
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
