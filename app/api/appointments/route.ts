import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import AppointmentModel, { IAppointment } from "@/model/appointment";
import { FilterQuery } from "mongoose";

await dbConnect();

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unknown error occurred";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const myIdParam = searchParams.get("myId");

    // Use FilterQuery for MongoDB operators
    const filter: FilterQuery<IAppointment> = {};

    if (statusParam) {
      const statuses = statusParam.split(",") as IAppointment["status"][];
      filter.status = { $in: statuses };
    }

    if (myIdParam) {
      filter.myId = myIdParam;
    }

    const appointments = await AppointmentModel.find(filter);
    return NextResponse.json(appointments, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST new appointment
export async function POST(request: NextRequest) {
  try {
    const body: Partial<IAppointment> = await request.json();
    const newAppointment = await AppointmentModel.create(body);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
