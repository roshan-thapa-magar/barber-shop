import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import ServiceModel from "@/model/service";

// GET service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = params;

    const service = await ServiceModel.findById(id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH update service
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = params;
    const body: Partial<{
      name: string;
      description: string;
      price: number;
      duration: number;
      status: string;
    }> = await request.json();

    const updatedService = await ServiceModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(updatedService);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = params;

    const deletedService = await ServiceModel.findByIdAndDelete(id);

    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
