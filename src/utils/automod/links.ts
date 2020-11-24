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
    message.content.includes("https://") ||
    message.content.includes("http://") ||
    message.content.includes(".com")
  ) {
    if (message.deletable) await message.delete();

    await message.channel.send(
      embeds.normal(
        `Link Warning`,
        `You have been warned for using a link in the chat!`
      )
    );

    await WarnModel.create({
      userId: message.author.id,
      createdAt: Date.now(),
      reason: "Send a link in the chat.",
    });
  }
}
