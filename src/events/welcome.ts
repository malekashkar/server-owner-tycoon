import { GuildMember, TextChannel } from "discord.js";
import Event, { EventNameType } from ".";
import { channels } from "../utils/storage";

export default class Welcome extends Event {
  name: EventNameType = "guildMemberAdd";

  async handle(member: GuildMember) {
    const welcomeChannel = member.guild.channels.resolve(
      channels.welcome
    ) as TextChannel;
    welcomeChannel.send(`**HELLO** there, ${member}!`);
  }
}
