import dotenv from "dotenv";

dotenv.config();

const envVars = {
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  ACTION_LOG_CHANNEL: process.env.ACTION_LOG_CHANNEL,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: Number(process.env.DB_PORT ?? 5432),
  DB_NAME: process.env.DB_NAME,
};

const missingVars = Object.entries(envVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing environment variables: ${missingVars.join(", ")}`);
}

export interface Config {
  NODE_ENV: string;
  CLIENT_ID: string;
  GUILD_ID: string;
  DISCORD_TOKEN: string;
  ACTION_LOG_CHANNEL: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
}

export const config: Config = {
  NODE_ENV: envVars.NODE_ENV,
  CLIENT_ID: envVars.CLIENT_ID!,
  GUILD_ID: envVars.GUILD_ID!,
  DISCORD_TOKEN: envVars.DISCORD_TOKEN!,
  ACTION_LOG_CHANNEL: envVars.ACTION_LOG_CHANNEL!,
  DB_USER: envVars.DB_USER!,
  DB_PASSWORD: envVars.DB_PASSWORD!,
  DB_HOST: envVars.DB_HOST!,
  DB_PORT: envVars.DB_PORT!,
  DB_NAME: envVars.DB_NAME!,
};
