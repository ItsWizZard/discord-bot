import { EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config/index.js";
import { hasPermissions } from "../../middleware/index.js";
import { createModerationLog } from "../../repositories/moderation-log/index.js";
import logger from "../../utils/logger.js";

export interface KickMemberInput {
  interaction: ChatInputCommandInteraction;
  caller: GuildMember | null;
  target: GuildMember | null;
  reason: string;
}

export async function kickMember({ interaction, caller, target, reason }: KickMemberInput): Promise<string> {
  try {
    if (!caller) return "Cannot determine your member object.";
    if (!target) return "User not found or not in this server.";
    if (!hasPermissions(caller, PermissionFlagsBits.KickMembers)) return "You do not have permission to kick members.";

    const guild = interaction.guild;
    const botMember = guild?.members.me;
    if (!guild || !botMember || !hasPermissions(botMember, PermissionFlagsBits.KickMembers)) {
      return "I do not have permission to kick members.";
    }
    if (target.roles.highest.position >= caller.roles.highest.position) {
      return "You cannot kick someone with equal or higher role than you.";
    }
    if (target.roles.highest.position >= botMember.roles.highest.position) {
      return "I cannot kick this user (role hierarchy).";
    }

    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor("#ea580c")
      .setTitle("Member Kicked")
      .setThumbnail(target.displayAvatarURL())
      .addFields({ name: "User", value: target.toString(), inline: true })
      .addFields({ name: "By", value: interaction.user.toString(), inline: true })
      .addFields({ name: "Reason", value: reason, inline: false })
      .setFooter({ text: botMember.displayName, iconURL: botMember.displayAvatarURL() })
      .setTimestamp(new Date());

    const logChannel = guild.channels.cache.get(config.ACTION_LOG_CHANNEL) as TextChannel;
    if (logChannel) await logChannel.send({ embeds: [embed] });

    await createModerationLog({
      targetId: target.id,
      targetTag: target.user.tag,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      action: "kick",
      reason,
      metadata: {},
    });

    return `<@${target.id}> has been kicked successfully.`;
  } catch (error) {
    logger.error({ err: error }, "Failed to kick member.");
    return "Failed to kick member.";
  }
}
