import { Invite } from "discord.js";
import Event from ".";
import Client from "../structures/client";

export default class updateInvites extends Event {
  name = "inviteCreate";

  async handle(client: Client, invite: Invite) {
    client.invites.set(invite.guild.id, await invite.guild.fetchInvites());
  }
}
