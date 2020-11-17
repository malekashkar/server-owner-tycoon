import { Message } from "discord.js";

export default async function react(msg: Message, reactions: string[]) {
  for (let i = 0; i < reactions.length; i++) {
    try {
      if ((await msg.fetch())?.deleted) break;
      await msg.react(reactions[i]);
    } catch (ignore) {}
  }
}
