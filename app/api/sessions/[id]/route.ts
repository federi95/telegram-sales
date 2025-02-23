import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { deleteById } from "@/modules/session/session.service";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const _id = +id;

    if (Number.isNaN(_id))
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Id must be conforming to a number",
        },
        { status: 400 }
      );

    const channel = await deleteById(+id);

    return NextResponse.json(channel, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid request", errors: error.errors },
        { status: 400 }
      );

    return NextResponse.json(
      { error: "Failed to delete channel" },
      { status: 500 }
    );
  }
}
