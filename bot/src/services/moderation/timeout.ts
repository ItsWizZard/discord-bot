import { EmbedBuilder, GuildMember, PermissionFlagsBits, TextChannel } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { config } from "../../config/index.js";
import { hasPermissions } from "../../middleware/index.js";
import { createModerationLog } from "../../repositories/moderation-log/index.js";
import logger from "../../utils/logger.js";

export interface TimeoutMemberInput {
  interaction: ChatInputCommandInteraction;
  caller: GuildMember | null;
  target: GuildMember | null;
  duration: number;
  reason: string;
}

export async function timeoutMember({
  interaction,
  caller,
  target,
  duration,
  reason,
}: TimeoutMemberInput): Promise<string> {
  try {
    if (!caller) return "Cannot determine your member object.";
    if (!target) return "User not found or not in this server.";
    if (!hasPermissions(caller, PermissionFlagsBits.ModerateMembers)) {
      return "You do not have permission to timeout members.";
    }

    const guild = interaction.guild;
    const botMember = guild?.members.me;
    if (!guild || !botMember || !hasPermissions(botMember, PermissionFlagsBits.ModerateMembers)) {
      return "I do not have permission to timeout members.";
    }
    if (target.roles.highest.position >= caller.roles.highest.position) {
      return "You cannot timeout this user because they have a higher or equal role than you.";
    }
    if (target.roles.highest.position >= botMember.roles.highest.position) {
      return "I cannot timeout this user because they have a higher or equal role than me.";
    }

    await target.timeout(duration * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor("#ea580c")
      .setTitle("Member Timed Out")
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "User", value: target.toString(), inline: true },
        { name: "Duration", value: `${duration} minute(s)`, inline: true },
        { name: "By", value: interaction.user.toString(), inline: true },
        { name: "Reason", value: reason, inline: false },
      )
      .setFooter({ text: botMember.displayName, iconURL: botMember.displayAvatarURL() })
      .setTimestamp(new Date());

    const logChannel = guild.channels.cache.get(config.ACTION_LOG_CHANNEL) as TextChannel;
    if (logChannel) await logChannel.send({ embeds: [embed] });

    await createModerationLog({
      targetId: target.id,
      targetTag: target.user.tag,
      moderatorId: interaction.user.id,
      moderatorTag: interaction.user.tag,
      action: "timeout",
      reason,
      metadata: { duration },
    });

    return `<@${target.id}> has been timed out successfully.`;
  } catch (error) {
    logger.error({ err: error }, "Failed to timeout a member.");
    return "Failed to timeout a member.";
  }
}
