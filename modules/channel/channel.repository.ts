import { count as _count, eq, or } from "drizzle-orm";

import { db } from "@/db";
import { Channel, channelsTable } from "@/db/schema";
import { IQueryParams } from "@/types/api";
import { sort } from "@/utils/query";

import { ChannelData } from "./channel.types";

export async function count() {
  const total = await db.select({ count: _count() }).from(channelsTable);

  if (total.length === 0) return 0;
  return total[0].count;
}
async function getAll(params?: Partial<IQueryParams>): Promise<Channel[]> {
  const _sort = sort(channelsTable, params?.sort);
  const { page = 1, limit = 10 } = params ?? {};

  const data = await db
    .select()
    .from(channelsTable)
    .orderBy(..._sort)
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

async function getById(id: number): Promise<Channel | null> {
  const [channel] = await db
    .select()
    .from(channelsTable)
    .where(eq(channelsTable.id, id));

  return channel ?? null;
}

async function create(data: ChannelData): Promise<Channel> {
  const [channel] = await db.insert(channelsTable).values(data).returning();
  return channel;
}

async function update(
  id: number,
  data: Partial<ChannelData>
): Promise<Channel> {
  const [channel] = await db
    .update(channelsTable)
    .set(data)
    .where(eq(channelsTable.id, id))
    .returning();

  if (!channel) throw new Error(`Channel with id ${id} not found`);
  return channel;
}

async function remove(id: number): Promise<Channel> {
  const [channel] = await db
    .delete(channelsTable)
    .where(eq(channelsTable.id, id))
    .returning();

  if (!channel) throw new Error(`Channel with id ${id} not found`);
  return channel;
}

async function exists(data: ChannelData): Promise<boolean> {
  const exists = await db
    .select()
    .from(channelsTable)
    .where(
      or(eq(channelsTable.name, data.name), eq(channelsTable.url, data.url))
    );

  return exists.length > 0;
}

export { create, exists, getAll, getById, remove, update };
