import { AnyColumn, asc, desc, SQL } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";

import { DEFAULT_QUERY_META } from "@/constants";
import { IPaginate } from "@/types/api";

function getTableProperty<T extends SQLiteTable>(
  table: T,
  field: string
): AnyColumn | null {
  if (Object.prototype.hasOwnProperty.call(table, field))
    return table[field as keyof T] as AnyColumn;

  return null;
}

export function paginate({ page, limit, total }: IPaginate) {
  const _page = page && page > 0 ? page : DEFAULT_QUERY_META.page;
  const _limit =
    limit && limit >= 1 && limit <= 5000 ? limit : DEFAULT_QUERY_META.limit;

  const start = (_page - 1) * _limit;
  const end = start + _limit;
  const pages = Math.ceil(total / _limit);

  if ((pages > 0 && _page > pages) || _page < 1)
    throw new Error("Page out of range");

  return { page: _page, limit: _limit, start, end, pages };
}

export function sort<T extends SQLiteTable>(table: T, sortBy?: string | null) {
  const _sort = sortBy ? JSON.parse(sortBy) : {};
  const clauses: SQL[] = [];

  for (const [field, order] of Object.entries(_sort)) {
    const column = getTableProperty(table, field);
    if (column) clauses.push(order === "desc" ? desc(column) : asc(column));
  }

  return clauses;
}
