import type { Command } from "../types/BotCommand.js";

export function organizeCommandsByCategory(commands: Map<string, Command>) {
  const categorizedCommands = new Map<string, string[]>();

  for (const [name, command] of commands) {
    const category = command.category || "Uncategorized";
    if (!categorizedCommands.has(category)) {
      categorizedCommands.set(category, []);
    }
    categorizedCommands.get(category)?.push(`\`${name}\``);
  }

  return Array.from(categorizedCommands.entries()).map(([category, cmds]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: cmds.sort().join(", "),
    inline: false,
  }));
}
