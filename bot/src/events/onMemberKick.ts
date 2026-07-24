import { recordExternalKick } from "../services/moderation/index.js";
import type { BotEvent } from "../types/BotEvent.js";

const event: BotEvent<"guildMemberRemove"> = {
  name: "guildMemberRemove",
  run: async (_client, member) => recordExternalKick(member.id, member.guild),
};

export default event;
