import { REST, Routes } from "discord.js";
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { config } from "../config/index.js";
import { commands } from "../loaders/command.loader.js";
import logger from "./logger.js";

const api = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

export async function redeployCommands(data: RESTPostAPIChatInputApplicationCommandsJSONBody[]) {
  logger.info("Clearing existing commands...");

  if (config.NODE_ENV === "development") {
    await api.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: [] });
    logger.debug("Cleared guild commands");

    await api.put(Routes.applicationCommands(config.CLIENT_ID), { body: [] });
    logger.debug("Cleared global commands");

    logger.debug("Development mode: Registering guild commands...");
    await api.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: data });
    logger.debug(`Successfully registered ${data.length} guild commands`);
  } else {
    logger.info("Clearing existing commands...");
    await api.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: [] });
    logger.info("Cleared guild commands");

    logger.info("Production mode: Registering global commands...");
    await api.put(Routes.applicationCommands(config.CLIENT_ID), { body: data });
    logger.info(`Successfully registered ${data.length} global commands`);
  }

  logger.info(`Registered ${commands.size} commands.`);
}
