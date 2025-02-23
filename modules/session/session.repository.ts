import { count as _count, eq } from "drizzle-orm";

import { db } from "@/db";
import { Session, sessionsTable } from "@/db/schema";
import { IQueryParams } from "@/types/api";
import { sort } from "@/utils/query";

export async function count() {
  const total = await db.select({ count: _count() }).from(sessionsTable);

  if (total.length === 0) return 0;
  return total[0].count;
}
async function getAll(params?: Partial<IQueryParams>): Promise<Session[]> {
  const _sort = sort(sessionsTable, params?.sort);
  const { page = 1, limit = 10 } = params ?? {};

  const data = await db
    .select()
    .from(sessionsTable)
    .orderBy(..._sort)
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

async function create(session: string): Promise<Session> {
  const [data] = await db
    .insert(sessionsTable)
    .values({ data: session })
    .returning();
  return data;
}

async function get(id?: number): Promise<Session | null> {
  const session = await db.query.sessionsTable.findFirst({
    where: id ? eq(sessionsTable.id, id) : undefined,
  });

  return session ?? null;
}

async function remove(id: number): Promise<Session> {
  const [session] = await db
    .delete(sessionsTable)
    .where(eq(sessionsTable.id, id))
    .returning();

  if (!session) throw new Error(`Session with id ${id} not found`);
  return session;
}

export { create, get, getAll, remove };
