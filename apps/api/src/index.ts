import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { auth } from "./auth";
import { authUrl, port, webUrl } from "./env";

const betterAuth = new Elysia({ name: "better-auth" })
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({ headers });

				if (!session) return status(401);

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	});

const app = new Elysia()
	.use(
		cors({
			origin: webUrl,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(betterAuth)
	.get("/me", ({ user }) => user, { auth: true })
	.listen(port);

console.log(`🦊 Elysia is running at ${authUrl}`);

export type App = typeof app;
