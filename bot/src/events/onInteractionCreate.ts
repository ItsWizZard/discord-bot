import { MessageFlags } from "discord.js";
import { commands } from "../loaders/index.js";
import type { BotEvent } from "../types/BotEvent.js";
import logger from "../utils/logger.js";

const event: BotEvent<"interactionCreate"> = {
  name: "interactionCreate",
  run: async (_client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command || typeof command.run !== "function") return;

    try {
      await command.run(interaction);
    } catch (error) {
      logger.error(error, `Error executing command ${interaction.commandName}:`);

      if (!interaction.replied && !interaction.deferred) {
        await interaction
          .reply({
            content: "There was an error executing that command.",
            flags: MessageFlags.Ephemeral,
          })
          .catch((err) => {
            logger.error(err, "Error sending error response:");
          });
      } else if (interaction.deferred) {
        await interaction
          .editReply({
            content: "There was an error executing that command.",
          })
          .catch((err) => {
            logger.error(err, "Error editing error response:");
          });
      }
    }
  },
};

export default event;
