import { DocumentType } from "@typegoose/typegoose";
import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import UtilityCommand from ".";
import { CountryModel } from "../../models/country";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { countries, emojis } from "../../utils/storage";

export default class CountryCommand extends UtilityCommand {
  cmdName = "country";
  description = "Restart the process to selecting your country.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const countryData = await CountryModel.findOne({
      userId: message.author.id,
    });
    if (countryData)
      return message.channel.send(
        embeds.error(
          `You already have a country selector channel open! ${message.guild.channels.resolve(
            countryData.channelId
          )}`
        )
      );
    if (guildData.joinCategory) {
      const formattedUsername =
        message.author.username.length > 15
          ? message.author.username.slice(0, 15)
          : message.author.username;
      const channel = await message.guild.channels.create(formattedUsername, {
        type: "text",
        parent: guildData.joinCategory,
        permissionOverwrites: [
          {
            id: message.author.id,
            allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
          },
          {
            id: message.guild.id,
            deny: "VIEW_CHANNEL",
          },
        ],
      });
      const continents = Object.keys(countries);
      const continentEmojis = emojis.slice(0, continents.length);
      const continentEmbed = embeds.normal(
        null,
        stripIndents`**HELLO** there, ${message.author.username}!
          What continent are you from? Click one of the reactions below!
          ${continents.map((x, i) => `${continentEmojis[i]} ${x}`).join("\n")}`
      );
      const continentMessage = await channel.send(continentEmbed);
      await react(continentMessage, continentEmojis);

      await CountryModel.create({
        startedAt: new Date(),
        userId: message.author.id,
        channelId: channel.id,
        entry: false
      });
    } else {
      message.channel.send(
        embeds.error(
          `Please ask administrators to set an entry category for country channels!`
        )
      );
    }
  }
}
