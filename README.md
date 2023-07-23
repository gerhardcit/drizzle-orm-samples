# Drizzle ORM and Clouddlare's D1

Steps to see the problem

1. `pnpm drizzle-kit generate:sqlite --schema=./schema.ts` 
2. Run using SQLite DB only
   1. pnpm tsx run-sqlite-core-json.ts
3. Run using D1 SQLite DB
   1. pnpm tsx run-sqlite-d1-json.ts

Expected output
```json
[
  {
    id: 1,
    name: 'test',
    roles: { foo: 'bar' },
    jobs: [ 'foo', 'bar' ]
  }
]
```

## Vitests

Also set of test using vitest

`pnpm vitest`