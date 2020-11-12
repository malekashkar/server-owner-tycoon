import { GuildMember } from "discord.js";
import Event from "..";

export default class removeInvites extends Event {
  name = "guildMemberRemove";

  async handle(member: GuildMember) {
    this.client.invites.set(member.guild.id, await member.guild.fetchInvites());
  }
}
