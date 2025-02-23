import { and, count as _count, eq } from "drizzle-orm";

import { db } from "@/db";
import { Product, productsTable } from "@/db/schema";
import { IQueryParams } from "@/types/api";
import { sort } from "@/utils/query";

import { ProductData } from "./product.types";

export async function count() {
  const total = await db.select({ count: _count() }).from(productsTable);

  if (total.length === 0) return 0;
  return total[0].count;
}
async function getAll(params?: Partial<IQueryParams>): Promise<Product[]> {
  const _sort = sort(productsTable, params?.sort);
  const { page = 1, limit = 10 } = params ?? {};

  const data = await db.query.productsTable.findMany({
    orderBy: _sort,
    offset: (page - 1) * limit,
    limit,
    with: { channel: true },
  });

  return data;
}

async function getById(id: number): Promise<Product | null> {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, id),
    with: { channel: true },
  });

  return product ?? null;
}

async function create(data: ProductData): Promise<Omit<Product, "channel">> {
  const [product] = await db.insert(productsTable).values(data).returning();
  return product;
}

async function update(
  id: number,
  data: Partial<ProductData>
): Promise<Omit<Product, "channel">> {
  const [product] = await db
    .update(productsTable)
    .set(data)
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) throw new Error(`Product with id ${id} not found`);
  return product;
}

async function remove(id: number): Promise<Omit<Product, "channel">> {
  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, id))
    .returning();

  if (!product) throw new Error(`Product with id ${id} not found`);
  return product;
}

async function exists(data: ProductData): Promise<boolean> {
  const exists = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.name, data.name),
        eq(productsTable.channelId, data.channelId)
      )
    );

  return exists.length > 0;
}

export { create, exists, getAll, getById, remove, update };
