import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { userBlobs } from './schemas/user-blob';
import { createSQLiteDB } from '@miniflare/shared';
import { D1Database, D1DatabaseAPI } from '@miniflare/d1';

// test migrate with D1Database and blob columns
async function main() {
    const sqlite = await createSQLiteDB(":memory:");
    const sqliteDB = new D1Database(new D1DatabaseAPI(sqlite));
    const db: BetterSQLite3Database = drizzle(sqliteDB);
    migrate(db, { migrationsFolder: 'drizzle' });

    db.insert(userBlobs).values({
        id: 1,
        name: "test",
        roles: { foo: "bar" },
        jobs: ["foo", "bar"]
    }).run();

    const result = db.select().from(userBlobs).all();
    console.log(result);
}

main();


