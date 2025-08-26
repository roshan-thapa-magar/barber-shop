import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import ServiceModel from "@/model/service";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // e.g., ?status=active

    let query = {};
    if (status) {
      query = { status }; // filter by status if provided
    }

    const services = await ServiceModel.find(query);
    return NextResponse.json(services, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    if (!body.type || !body.price) {
      return NextResponse.json(
        { error: "Type and price are required" },
        { status: 400 }
      );
    }

    const service = await ServiceModel.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
