function requiredEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not set`);
	}
	return value;
}

export const webUrl = requiredEnv("WEB_URL");
export const authUrl = requiredEnv("BETTER_AUTH_URL");

const parsedPort = Number(requiredEnv("API_PORT"));

if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
	throw new Error("API_PORT must be a positive integer");
}

export const port = parsedPort;
