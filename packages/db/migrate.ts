import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

if (!url) {
	throw new Error("DATABASE_URL is not set");
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
	await migrate(db, { migrationsFolder: "./migrations" });
	console.log("Migrations applied successfully");
} catch (error) {
	console.error("Migration failed:");
	console.error(error);
	const message = error instanceof Error ? error.message : String(error);
	if (/already exists/i.test(message)) {
		console.error(
			"\nHint: the database already has schema (e.g. from db:push). Reset local data with:\n  bun run db:reset && bun run db:migrate",
		);
	}
	process.exitCode = 1;
} finally {
	await client.end({ timeout: 5 });
}
