import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { CacheType, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface Command {
  data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  category?: string;
  run?: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction<CacheType>) => Promise<void>;
}
