import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { userBlobs } from './schemas/user-blob';
import { createSQLiteDB } from '@miniflare/shared';

// test migreate with Core SQLite and blob columns
async function main() {
    const sqliteDB = await createSQLiteDB(":memory:");
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


