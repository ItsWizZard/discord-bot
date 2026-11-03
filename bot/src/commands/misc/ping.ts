import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types/BotCommand.js";

const command: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  category: "Utility",
  run: async (interaction) => {
    await interaction.reply("Pong!");
  },
};

export default command;
