import Client from "../structures/client";
import { GuildMember } from "discord.js";
import Event from ".";

export default class removeInvites extends Event {
  name = "guildMemberRemove";

  async handle(client: Client, member: GuildMember) {
    client.invites.set(member.guild.id, await member.guild.fetchInvites());
  }
}
