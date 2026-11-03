import { GuildMember, MessageFlags, SlashCommandBuilder } from "discord.js";
import { timeoutMember } from "../../services/moderation/index.js";
import type { Command } from "../../types/BotCommand.js";

const command: Command = {
  category: "Moderation",
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member")
    .addUserOption((opt) => opt.setName("user").setDescription("User to timeout").setRequired(true))
    .addIntegerOption((opt) =>
      opt
        .setName("duration")
        .setDescription("Duration of the timeout in minutes (defaults to 10 minutes)")
        .setRequired(false),
    )
    .addStringOption((opt) => opt.setName("reason").setDescription("Reason for the timeout").setRequired(false)),

  run: async (interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const caller = interaction.member as GuildMember;

    const targetOption = interaction.options.getMember("user");
    const target = targetOption as GuildMember | null;

    const durationOption = interaction.options.getInteger("duration");
    const duration = durationOption || 10;

    const reasonOption = interaction.options.getString("reason");
    const reason = reasonOption || "No reason provided.";

    const content = await timeoutMember({ interaction, caller, target, duration, reason });
    await interaction.editReply({ content });
  },
};

export default command;
