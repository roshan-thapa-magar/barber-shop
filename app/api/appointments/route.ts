import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import AppointmentModel from "@/model/appointment";

await dbConnect();

// GET all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status"); // "scheduled,pending"

    let filter = {};
    if (statusParam) {
      const statusArray = statusParam.split(","); // ["scheduled", "pending"]
      filter = { status: { $in: statusArray } };
    }

    const appointments = await AppointmentModel.find(filter);
    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAppointment = await AppointmentModel.create(body);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
