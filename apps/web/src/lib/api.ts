import { treaty } from "@elysiajs/eden";
// Importamos APENAS a tipagem do backend do nosso monorepo
import type { App } from "../../../api/src/index";

export const api = treaty<App>("http://localhost:3333");
