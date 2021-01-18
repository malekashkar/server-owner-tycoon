import { DMChannel, Message, TextChannel } from "discord.js";
import embeds from "./embeds";
import react from "./react";

export default async function confirmation(
  title: string,
  text: string,
  message?: Message,
  channel?: TextChannel | DMChannel,
  userId?: string
) {
  const emojis = {
    yes: "✅",
    no: "❎",
  };

  channel = message ? (message.channel as TextChannel) : channel || null;
  userId = message ? message.author.id : userId || null;
  const msg = await channel.send(
    embeds.normal(
      title,
      `${text}\nYou have 30 seconds to react with the ${emojis.yes} or ${emojis.no}.`
    )
  );

  await react(msg, [emojis.yes, emojis.no]);

  const reactions = await msg.awaitReactions(
    (reaction, user) =>
      user.id === userId && Object.values(emojis).includes(reaction.emoji.name),
    { max: 1, time: 30000 }
  );

  if (msg.deletable) msg.delete();

  if (!reactions.size || reactions.first().emoji.name !== emojis.yes)
    return false;
  else return true;
}
