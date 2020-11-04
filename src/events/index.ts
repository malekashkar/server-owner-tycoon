import { ClientEvents } from "discord.js";
export type EventNameType = keyof ClientEvents;

export default abstract class Event {
  module: string;
  disabled = false;
  abstract name: string;

  abstract async handle(...args: unknown[]): Promise<void>;
}
