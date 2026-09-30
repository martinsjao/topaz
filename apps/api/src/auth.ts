import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db, schema } from "db";
import { authUrl, webUrl } from "./env";

export const auth = betterAuth({
	baseURL: authUrl,
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [webUrl],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	advanced: {
		database: {
			joins: true,
		},
	},
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
});
