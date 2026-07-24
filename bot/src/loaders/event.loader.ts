import { Client } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { BotEvent } from "../types/BotEvent.js";
import logger from "../utils/logger.js";

export async function registerEvents(client: Client): Promise<void> {
  const loaderDirectory = path.dirname(fileURLToPath(import.meta.url));
  const eventsDirectory = path.join(loaderDirectory, "../events");
  const files = fs
    .readdirSync(eventsDirectory)
    .filter((file) => (file.endsWith(".js") || file.endsWith(".ts")) && file !== "index.ts" && file !== "index.js");

  for (const file of files) {
    const eventModule = await import(pathToFileURL(path.join(eventsDirectory, file)).href);
    const event: BotEvent | undefined = eventModule.default?.default ?? eventModule.default;
    if (!event) {
      logger.error(`[SKIP] ${file}: missing default export`);
      continue;
    }

    const { name, once, run } = event;
    if (typeof run !== "function") {
      logger.error(`[SKIP] ${file}: missing valid run() handler`);
      continue;
    }

    if (once) client.once(name, (...args) => run(client, ...args));
    else client.on(name, (...args) => run(client, ...args));
    logger.info(`[EVENT] Registered ${file} → ${name}`);
  }
}
