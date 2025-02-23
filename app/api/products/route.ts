import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { create, list } from "@/modules/product/product.service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    const limit = url.searchParams.get("limit");
    const sort = url.searchParams.get("sort") ?? "";

    const result = await list({
      page: page ? Number.parseInt(page, 10) : undefined,
      limit: limit ? Number.parseInt(limit, 10) : undefined,
      sort,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid request", errors: error.errors },
        { status: 400 }
      );

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const product = await create(body);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        { error: "Invalid request", errors: error.errors },
        { status: 400 }
      );

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
