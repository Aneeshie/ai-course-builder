import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = neon(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
