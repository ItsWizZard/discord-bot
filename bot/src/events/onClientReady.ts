import { ActivityType } from "discord.js";
import { deployCommands } from "../loaders/index.js";
import type { BotEvent } from "../types/BotEvent.js";
import logger from "../utils/logger.js";

const event: BotEvent<"clientReady"> = {
  name: "clientReady",
  run: async (client) => {
    await deployCommands(client);
    logger.info(`Logged in as ${client.user?.tag}`);

    client.user?.setPresence({
      activities: [
        {
          name: "Under Development",
          type: ActivityType.Playing,
          state: "Something good is cooking...",
        },
      ],
      status: "online",
    });
  },
};

export default event;
