import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import InventoryModel from "@/model/inventory";

// ✅ Get all inventory items (optionally filter by status)
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  try {
    let query: any = {};
    if (status) query.status = status;

    const items = await InventoryModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// ✅ Add new inventory item
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const newItem = await InventoryModel.create(body);

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to add item", details: err.message },
      { status: 400 }
    );
  }
}
