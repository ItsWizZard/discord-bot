import { AuditLogEvent, EmbedBuilder, Guild, TextChannel } from "discord.js";
import { config } from "../../config/index.js";
import { createModerationLog } from "../../repositories/moderation-log/index.js";
import logger from "../../utils/logger.js";

export async function recordExternalKick(memberId: string, guild: Guild): Promise<void> {
  try {
    const auditLogs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
    const entry = auditLogs.entries.first();
    if (!entry) return;

    const { executor, target, reason, createdAt } = entry;
    const executorId = getUserId(executor);
    const targetId = getUserId(target);

    if (!executorId || !targetId || targetId !== memberId) {
      logger.info("Executor or target missing, or not matching member.");
      return;
    }
    if (executorId === config.CLIENT_ID) return;

    const executorUser = await guild.client.users.fetch(executorId);
    const targetUser = await guild.client.users.fetch(targetId);
    const removeEmbed = new EmbedBuilder()
      .setColor("#ea580c")
      .setTitle("Member Kicked")
      .setDescription(`<@${targetUser.id}> was **kicked** by <@${executorUser.id}>.`)
      .addFields({ name: "Reason", value: reason || "No reason provided." })
      .setAuthor({ name: targetUser.username || "Unknown", iconURL: targetUser.displayAvatarURL() })
      .setTimestamp(createdAt)
      .setFooter({ text: `Member ID: ${targetUser.id}` })
      .setThumbnail(targetUser.displayAvatarURL());

    const channel = guild.channels.cache.get(config.ACTION_LOG_CHANNEL) as TextChannel;
    if (channel) await channel.send({ embeds: [removeEmbed] });

    await createModerationLog({
      targetId: targetUser.id,
      targetTag: targetUser.tag,
      moderatorId: executorUser.id,
      moderatorTag: executorUser.tag,
      action: "kick",
      reason,
    });
  } catch (error) {
    logger.error(error, "Failed to process member kick audit log.");
  }
}

function getUserId(user: unknown): string | null {
  if (!user) return null;
  if (typeof user === "string") return user;

  if (typeof user === "object" && "id" in user && typeof user.id === "string") {
    const candidate = user as { id: string; tag?: unknown; username?: unknown };
    if (candidate.username !== undefined || candidate.tag !== undefined) return candidate.id;
  }

  return null;
}
