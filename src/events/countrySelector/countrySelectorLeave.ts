import { GuildMember } from "discord.js";
import Event from "..";
import { CountryModel } from "../../models/country";

export default class CountrySelectorLeave extends Event {
  name = "guildMemberRemove";

  async handle(member: GuildMember) {
    const countryData = await CountryModel.findOne({
      userId: member.id,
    });
    if (!countryData) return;

    await member.guild.channels.resolve(countryData.channelId).delete();
    await countryData.deleteOne();
  }
}
