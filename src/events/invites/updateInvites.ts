import { Invite } from "discord.js";
import Event from "..";

export default class updateInvites extends Event {
  name = "inviteCreate";

  async handle(invite: Invite) {
    this.client.invites.set(invite.guild.id, await invite.guild.fetchInvites());
  }
}
