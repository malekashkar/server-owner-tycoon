import { DocumentType } from "@typegoose/typegoose";
import { MessageEmbed } from "discord.js";
import Guild from "../models/guild";

export default class embeds {
  static error = function (
    guildData: DocumentType<Guild>,
    err: string,
    title = "Error Caught"
  ) {
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(`${err}`)
      .setColor("RED")
      .setTimestamp();

    if (guildData.watermark) embed.setFooter(guildData.watermark);

    return embed;
  };

  static normal = function (
    guildData: DocumentType<Guild>,
    title: string,
    desc: string
  ) {
    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(desc)
      .setColor("RANDOM")
      .setTimestamp();

    if (guildData.watermark) embed.setFooter(guildData.watermark);

    return embed;
  };

  static question = function (
    guildData: DocumentType<Guild>,
    question: string
  ) {
    const embed = new MessageEmbed()
      .setTitle(question)
      .setDescription(`You have 15 minutes to reply to the question above.`)
      .setColor("RANDOM")
      .setTimestamp();

    if (guildData.watermark) embed.setFooter(guildData.watermark);

    return embed;
  };
}
