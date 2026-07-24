import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { config } from "../config/index.js";
import { organizeCommandsByCategory } from "../utils/organizeCommands.js";
import { redeployCommands } from "../utils/redeployCommands.js";
import logger from "../utils/logger.js";
import { commands } from "./command.loader.js";

export async function deployCommands(client: Client): Promise<void> {
  const commandsData = Array.from(commands.values()).map((command) => command.data.toJSON());
  try {
    await redeployCommands(commandsData);
    await sendStartupEmbed(client, commandsData.length);
  } catch (error) {
    logger.error(error, "Failed to register commands:");
  }
}

async function findAndDeletePreviousEmbed(channel: TextChannel): Promise<void> {
  const messages = await channel.messages.fetch({ limit: 20 });
  const target = messages.find((message) => message.author.bot && message.embeds[0]?.title === "🤖 Bot Started");
  if (target) await target.delete().catch(() => null);
}

async function sendStartupEmbed(client: Client, commandsLength: number): Promise<void> {
  const logChannel = client.channels.cache.get(config.ACTION_LOG_CHANNEL) as TextChannel;
  if (!logChannel) {
    logger.debug("Log channel not found");
    return;
  }

  await findAndDeletePreviousEmbed(logChannel);
  const embed = new EmbedBuilder()
    .setTitle("🤖 Bot Started")
    .setDescription(`Successfully started and registered **${commandsLength}** commands in ${config.NODE_ENV} mode.`)
    .addFields(organizeCommandsByCategory(commands))
    .setColor("#16a34a")
    .setTimestamp()
    .setFooter({
      text: `${config.NODE_ENV.charAt(0).toUpperCase() + config.NODE_ENV.slice(1)} Mode • Bot Initialization`,
      iconURL: client.user?.displayAvatarURL({ extension: "webp", size: 32 }) as string,
    });

  await logChannel.send({ embeds: [embed] });
}
