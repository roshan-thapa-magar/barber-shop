import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import InventoryModel from "@/model/inventory";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const item = await InventoryModel.findById(params.id);
    if (!item)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const body = await req.json();
    const updated = await InventoryModel.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updated)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const deleted = await InventoryModel.findByIdAndDelete(params.id);
    if (!deleted)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
