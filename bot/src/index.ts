import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config/index.js";
import { loadCommands, registerEvents } from "./loaders/index.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await loadCommands();
await registerEvents(client);

client.login(config.DISCORD_TOKEN);
