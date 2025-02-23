import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { deleteById, getById, update } from "@/modules/channel/channel.service";

export async function GET(
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
          errors: ["Id must be conforming to a number"],
        },
        { status: 400 }
      );

    const channel = await getById(+id);

    if (!channel)
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    return NextResponse.json(channel, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid request", errors: error.errors },
        { status: 400 }
      );

    return NextResponse.json(
      { error: "Failed to get channel" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
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

    const channel = await update(+id, body);

    return NextResponse.json(channel, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid request", errors: error.errors },
        { status: 400 }
      );

    return NextResponse.json(
      { error: "Failed to get channel" },
      { status: 500 }
    );
  }
}

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
