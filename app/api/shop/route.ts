import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import ShopModel from "@/model/shop";

// GET: fetch latest shop status
export async function GET() {
  try {
    await dbConnect();
    const shop = await ShopModel.findOne().sort({ createdAt: -1 });

    return NextResponse.json({
      shopStatus: shop?.shopStatus || "closed",
      openingTime: shop?.openingTime || null,
      closingTime: shop?.closingTime || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: create a new shop entry
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const shop = new ShopModel(body);
    await shop.save();

    return NextResponse.json(shop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT: update latest shop record
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    let shop = await ShopModel.findOne().sort({ createdAt: -1 });

    if (!shop) {
      shop = new ShopModel(body);
    } else {
      Object.assign(shop, body);
    }

    await shop.save();

    return NextResponse.json({
      shopStatus: shop.shopStatus,
      openingTime: shop.openingTime,
      closingTime: shop.closingTime,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
