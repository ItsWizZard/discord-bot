import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Command } from "../types/BotCommand.js";
import logger from "../utils/logger.js";

const loaderDirectory = path.dirname(fileURLToPath(import.meta.url));
export const commands = new Map<string, Command>();

export async function loadCommands(directory = path.join(loaderDirectory, "../commands")): Promise<number> {
  const commandFiles = fs.readdirSync(directory);
  let commandCount = 0;

  for (const file of commandFiles) {
    const categoryPath = path.join(directory, file);
    if (!fs.statSync(categoryPath).isDirectory()) {
      logger.error(`[COMMAND] ${file} needs to be apart of a subfolder (category)`);
      continue;
    }

    const files = fs.readdirSync(categoryPath).filter((entry) => entry.endsWith(".js") || entry.endsWith(".ts"));
    for (const commandFile of files) {
      if (commandFile === "index.ts" || commandFile === "index.js") continue;

      const commandPath = path.join(categoryPath, commandFile);
      const commandModule = await import(pathToFileURL(commandPath).href);
      const command: Command = commandModule.default?.default ?? commandModule.default;

      if (!command.data || typeof command.run !== "function") {
        logger.error(`[SKIP] ${commandFile}: invalid command export`);
        continue;
      }

      commands.set(command.data.name, { ...command, category: command.category ?? file });
      logger.debug(`Loading command: ${command.data.name} (${command.category})`);
      commandCount++;
    }
  }

  logger.info(`${commandCount} command(s) loaded`);
  logger.debug(
    `Loaded commands: ${Array.from(commands.entries())
      .map(([name, command]) => `${name} (${command.category})`)
      .join(", ")}`,
  );
  return commandCount;
}
