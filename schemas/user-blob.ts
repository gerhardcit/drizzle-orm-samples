import { blob, integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const userBlobs = sqliteTable('user_blobs', {
	id: integer('id'),
    name: text('name'),
    roles: blob('roles', { mode: 'json' }).$type<{ foo: string }>(),
    jobs: blob('jobs', { mode: 'json' }).$type<string[]>()
});