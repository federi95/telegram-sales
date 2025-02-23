import {
  relations,
  sql
} from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { InferQueryModel } from "../types/db";

export const channelsTable = sqliteTable("channel", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  cron: text("cron").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const productsTable = sqliteTable("product", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  channelId: integer("channel_id").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const sessionsTable = sqliteTable("session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  data: text("data").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const productsRelations = relations(productsTable, ({ one }) => ({
  channel: one(channelsTable, {
    fields: [productsTable.channelId],
    references: [channelsTable.id],
  }),
}));

export type Channel = typeof channelsTable.$inferSelect;

export type Product = InferQueryModel<
  "productsTable",
  {
    with: {
      channel: true;
    };
  }
>;

export type Session = typeof sessionsTable.$inferSelect;
