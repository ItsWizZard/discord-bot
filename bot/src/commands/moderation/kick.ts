import { GuildMember, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { kickMember } from "../../services/moderation/index.js";
import type { Command } from "../../types/BotCommand.js";

const command: Command = {
  category: "Moderation",
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption((opt) => opt.setName("user").setDescription("User to kick").setRequired(true))
    .addStringOption((opt) => opt.setName("reason").setDescription("Reason for the kick").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  run: async (interaction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const caller = interaction.member as GuildMember;

    const targetOption = interaction.options.getMember("user");
    const target = targetOption as GuildMember | null;

    const reasonOption = interaction.options.getString("reason");
    const reason = reasonOption || "No reason provided.";

    const content = await kickMember({ interaction, caller, target, reason });
    await interaction.editReply({ content });
  },
};

export default command;
