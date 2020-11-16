import { stripIndents } from "common-tags";
import { GuildMember } from "discord.js";
import Event from "..";
import { CountryModel } from "../../models/country";
import { GuildModel } from "../../models/guild";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { countries, emojis } from "../../utils/storage";

export default class CountrySelectorEvent extends Event {
  name = "guildMemberAdd";

  async handle(member: GuildMember) {
    const guildData =
      (await GuildModel.findOne({ guildId: member.guild.id })) ||
      (await GuildModel.create({ guildId: member.guild.id }));
    if (guildData.joinCategory) {
      const formattedUsername =
        member.user.username.length > 15
          ? member.user.username.slice(0, 15)
          : member.user.username;
      const channel = await member.guild.channels.create(formattedUsername, {
        type: "text",
        parent: guildData.joinCategory,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
          },
          {
            id: member.guild.id,
            deny: "VIEW_CHANNEL",
          },
        ],
      });
      const continents = Object.keys(countries);
      const continentEmojis = emojis.slice(0, continents.length);
      const continentEmbed = embeds.normal(
        null,
        stripIndents`**HELLO** there, ${member.user.username}!
        What continent are you from? Click one of the reactions below!
        ${continents.map((x, i) => `${continentEmojis[i]} ${x}`).join("\n")}`
      );
      const continentMessage = await channel.send(continentEmbed);
      await react(continentMessage, continentEmojis);

      await CountryModel.create({
        startedAt: new Date(),
        userId: member.id,
        channelId: channel.id,
      });
    }
  }
}
