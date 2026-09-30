import { treaty } from "@elysiajs/eden";
import type { App } from "../../../api/src/index";
import { apiUrl } from "./env";

export const api = treaty<App>(apiUrl);
