import { Message } from "discord.js";

export default async function react(msg: Message, reactions: string[]) {
  for (const r of reactions) {
    try {
      if (!msg.deleted) await msg.react(r).catch();
    } catch (i) {}
  }
}
