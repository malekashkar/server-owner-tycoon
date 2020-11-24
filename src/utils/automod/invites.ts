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
    message.content.includes("discord.gg") ||
    message.content.includes("https://discord.gg") ||
    message.content.includes("http://discord.gg")
  ) {
    if (message.deletable) await message.delete();

    await message.channel.send(
      embeds.normal(
        `Invite Warning`,
        `You have been warned for using an invite in the chat!`
      )
    );

    await WarnModel.create({
      userId: message.author.id,
      createdAt: Date.now(),
      reason: "Sent an invite link in the chat.",
    });
  }
}
