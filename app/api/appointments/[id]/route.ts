import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import AppointmentModel from "@/model/appointment";

await dbConnect();

// Helper to extract error message safely
const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unknown error occurred";

// GET single appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointment = await AppointmentModel.findById(params.id);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(appointment);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT update appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAppointment);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedAppointment = await AppointmentModel.findByIdAndDelete(
      params.id
    );
    if (!deletedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
