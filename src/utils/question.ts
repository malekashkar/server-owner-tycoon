import { Message } from "discord.js";
import embeds from "./embeds";
import { GuildModel } from "../models/guild";

export default async function question(
  question: string,
  questionForId: string,
  message: Message,
  required?: string[]
) {
  const guildData =
    (await GuildModel.findOne({ guildId: message.guild.id })) ||
    (await GuildModel.create({ guildId: message.guild.id }));

  const msg = await message.channel.send(embeds.question(guildData, question));
  const answer = await message.channel.awaitMessages(
    (x) =>
      x.author.id === questionForId && required && required.length
        ? required.includes(x.content)
        : true,
    {
      max: 1,
      time: 900000,
      errors: ["time"],
    }
  );

  if (msg.deletable) msg.delete();
  if (answer.first().deletable) answer.first().delete();

  return answer ? answer.first().content : null;
}
