import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  clerkId: text("clerk_id").notNull().unique(),

  email: text("email"),

  name: text("name"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});


export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  title: text("title").notNull(),

  prompt: text("prompt").notNull(),

  level: text("level")
    .$type<"beginner" | "intermediate" | "advanced">(),

  status: text("status")
    .$type<"generating" | "ready" | "failed">()
    .default("generating"),

  content: jsonb("content"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
