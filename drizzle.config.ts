import type { Config } from "drizzle-kit";

export default {
  schema: "./schemas/*.ts",
  driver: 'better-sqlite',
  dbCredentials: {
    url: "./sqlite.db"
  },
  out: "./drizzle"
} satisfies Config;