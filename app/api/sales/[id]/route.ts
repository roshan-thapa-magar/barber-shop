import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import InventoryModel from "@/model/inventory";
import SalesModel from "@/model/sales";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { quantity } = await req.json();
    if (!quantity || quantity <= 0)
      return NextResponse.json(
        { error: "Quantity must be > 0" },
        { status: 400 }
      );

    const item = await InventoryModel.findById(params.id);
    if (!item)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.quantity < quantity)
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );

    item.quantity -= quantity;
    if (item.quantity === 0) item.status = "out-of-stock";
    else if (item.quantity < 5) item.status = "low-stock";
    else item.status = "in-stock";

    await item.save();

    const sale = await SalesModel.create({
      name: item.name,
      quantity,
      price: item.price,
      inventoryId: item._id,
    });

    return NextResponse.json({ item, sale }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to process sale", details: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const sale = await SalesModel.findByIdAndDelete(params.id);
    if (!sale)
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to delete sale", details: err.message },
      { status: 500 }
    );
  }
}
