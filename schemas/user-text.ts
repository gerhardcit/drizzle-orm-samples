import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const userTexts = sqliteTable('user_texts', {
	id: integer('id'),
    name: text('name'),
    roles: text('roles'),
    jobs: text('jobs')
});