import embeds from "../../utils/embeds";
import { Message } from "discord.js";
import DbUser from "../../models/user";
import DbGuild from "../../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import { WarnModel } from "../../models/warn";

export default async function (
  message: Message,
  userData: DocumentType<DbUser>,
  guildData: DocumentType<DbGuild>
) {
  if (
    Date.now() - message.channel.lastMessage.createdTimestamp <=
    guildData.moderation.spamTime
  )
    userData.messageSpamMatch += 1;

  if (
    guildData.moderation.spamMessageAmount === userData.messageSpamMatch &&
    Date.now() - message.channel.lastMessage.createdTimestamp <=
      guildData.moderation.spamTime
  ) {
    if (message.deletable) message.delete();
    userData.messageSpamMatch = 0;

    await WarnModel.create({
      userId: message.author.id,
      createdAt: Date.now(),
      reason: "Spamming messages too fast.",
    });

    return message.channel.send(
      embeds.normal(
        `Message Spam`,
        `You have been warned for spamming messages!`
      )
    );
  }

  await userData.save();
}
