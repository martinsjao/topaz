import { closeDb } from "../src/client";

async function main() {
	console.log("No seeds defined.");
}

main()
	.then(() => closeDb())
	.catch(async (error) => {
		console.error(error);
		await closeDb().catch(() => undefined);
		process.exit(1);
	});
