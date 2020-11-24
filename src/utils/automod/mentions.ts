import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import DbGuild from "../../models/guild";
import { WarnModel } from "../../models/warn";
import embeds from "../embeds";

export default async function (
  message: Message,
  guildData: DocumentType<DbGuild>
) {
  if (
    message.mentions.users.size + message.mentions.roles.size >
    guildData.moderation.mentions
  ) {
    if (message.deletable) await message.delete();

    await message.channel.send(
      embeds.normal(
        `Mentions Warning`,
        `You have been warned for mentioning more than ${guildData.moderation.mentions} roles and/or users!`
      )
    );

    await WarnModel.create({
      userId: message.author.id,
      createdAt: Date.now(),
      reason: `Tagged more than ${guildData.moderation.mentions} roles and/or users.`,
    });
  }
}
