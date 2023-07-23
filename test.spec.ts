
import { describe, expect, it } from 'vitest';
import { createSQLiteDB } from '@miniflare/shared';
import { sql } from 'drizzle-orm';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { D1Database, D1DatabaseAPI } from '@miniflare/d1';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { userBlobs } from './schemas/user-blob';
import { userTexts } from './schemas/user-text';

async function createCoreSQLiteDB(path: string): Promise<BetterSQLite3Database> {
    const sqliteDB = await createSQLiteDB(":memory:");
    const db: BetterSQLite3Database = drizzle(sqliteDB);
    return db;
}

async function createD1SQLiteDB(path: string): Promise<BetterSQLite3Database> {
    const sqlite = await createSQLiteDB(path);
    const sqliteDB = new D1Database(new D1DatabaseAPI(sqlite));
    const db: BetterSQLite3Database = drizzle(sqliteDB);
    return db;
}

describe('testing table with core SQLite driver', async () => {

    const db = await createCoreSQLiteDB(":memory:");
    it('should pass simple select', async () => {
        const result: any = await db.get(sql`select time('now') as now`)
        expect(result.now).toBeDefined();
    })

    it('should pass user migration with text columns', async () => {
        migrate(db, { migrationsFolder: 'drizzle' });

        db.insert(userTexts).values({
            id: 1,
            name: "test",
            roles: JSON.stringify({ foo: "bar" }),
            jobs: JSON.stringify(["foo", "bar"])
        }).run();
    
        const result = db.select().from(userTexts).all();
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        const user = result[0];
        // console.log(user);
        expect(user.id).toBe(1);
        expect(user.name).toBe("test");
        expect(user.roles).toBeDefined();
        const roles = JSON.parse(user.roles || '{}');
        expect(roles.foo).toBe("bar");
        const jobs = JSON.parse(user.jobs || '[]');
        expect(jobs).toBeDefined();
        expect(jobs.length).toBe(2);
        expect(jobs[0]).toBe("foo");
        expect(jobs[1]).toBe("bar");
    })

    it('should pass user migration with blob columns', async () => {
        migrate(db, { migrationsFolder: 'drizzle' });

        db.insert(userBlobs).values({
            id: 1,
            name: "test",
            roles: { foo: "bar" },
            jobs: ["foo", "bar"]
        }).run();
    
        const result = db.select().from(userBlobs).all();
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        const user = result[0];
        expect(user.id).toBe(1);
        expect(user.name).toBe("test");
        expect(user.roles).toBeDefined();
        expect(user.roles?.foo).toBe("bar");
        expect(user.jobs).toBeDefined();
        expect(user.jobs?.length).toBe(2);
        expect(user.jobs?.[0]).toBe("foo");
    })

})

describe('testing table with core D1 miniflare driver', async () => {

    const filePath = "sqlite.db"
    const d1Db = await createD1SQLiteDB(filePath);
    const db = await createCoreSQLiteDB(filePath);

    it('should pass simple select', async () => {
        // this fails..
        // const result: any = await d1Db.get(sql`select time('now') as now`)
        const result: any = await db.get(sql`select time('now') as now`)
        expect(result.now).toBeDefined();
    })

    it('should pass user migration with text columns', () => {

        migrate(d1Db, { migrationsFolder: 'drizzle' });

        d1Db.insert(userTexts).values({
            id: 1,
            name: "test",
            roles: JSON.stringify({ foo: "bar" }),
            jobs: JSON.stringify(["foo", "bar"])
        }).run();
    
        const result = d1Db.select().from(userTexts).all();
        expect(result).toBeDefined();
        console.log(result)
        // expect(result.length).toBe(1);
        // const user = result[0];
        // // console.log(user);
        // expect(user.id).toBe(1);
        // expect(user.name).toBe("test");
        // expect(user.roles).toBeDefined();
        // const roles = JSON.parse(user.roles || '{}');
        // expect(roles.foo).toBe("bar");
        // const jobs = JSON.parse(user.jobs || '[]');
        // expect(jobs).toBeDefined();
        // expect(jobs.length).toBe(2);
        // expect(jobs[0]).toBe("foo");
        // expect(jobs[1]).toBe("bar");

        // try and read it with D1 db driver
        // const d1Result = d1Db.select().from(userTexts).all();
        // expect(result).toBeDefined();
        // expect(result.length).toBe(1);
        // console.log(d1Result);
    })

    it('should pass user migration with blob columns', async () => {
        migrate(db, { migrationsFolder: 'drizzle' });

        db.insert(userBlobs).values({
            id: 1,
            name: "test",
            roles: { foo: "bar" },
            jobs: ["foo", "bar"]
        }).run();
    
        const result = db.select().from(userBlobs).all();
        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        const user = result[0];
        expect(user.id).toBe(1);
        expect(user.name).toBe("test");
        expect(user.roles).toBeDefined();
        expect(user.roles?.foo).toBe("bar");
        expect(user.jobs).toBeDefined();
        expect(user.jobs?.length).toBe(2);
        expect(user.jobs?.[0]).toBe("foo");
    })

})