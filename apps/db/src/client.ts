import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const envCandidates = [
	resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
	resolve(process.cwd(), "apps/db/.env"),
	resolve(process.cwd(), "../db/.env"),
];

if (!process.env.DATABASE_URL) {
	for (const envFile of envCandidates) {
		if (!existsSync(envFile)) continue;
		process.loadEnvFile(envFile);
		if (process.env.DATABASE_URL) break;
	}
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
export { schema };
