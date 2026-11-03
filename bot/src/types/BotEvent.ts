import type { Client, ClientEvents } from "discord.js";

export type BotEventName = keyof ClientEvents;

export interface BotEventHandler<E extends BotEventName = BotEventName> {
  (client: Client, ...args: ClientEvents[E]): void | Promise<void>;
}

export interface BotEvent<E extends BotEventName = BotEventName> {
  name: E;
  once?: boolean;
  run: BotEventHandler<E>;
}
