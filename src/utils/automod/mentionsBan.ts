import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import DbGuild from "../../models/guild";
import embeds from "../embeds";

export default async function (
  message: Message,
  guildData: DocumentType<DbGuild>
) {
  if (
    message.mentions.users.size + message.mentions.roles.size >
    guildData.moderation.mentionsBan
  ) {
    if (message.deletable) await message.delete();
    await message.member.ban();
    await message.channel.send(
      embeds.normal(
        `Mentions Ban`,
        `${message.author.tag} has been banned for mentioning more than ${guildData.moderation.mentions} roles and/or users!`
      )
    );
  }
}
