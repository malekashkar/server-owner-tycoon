import { Invite } from "discord.js";
import Event, { EventNameType } from "..";

export default class updateInvites extends Event {
  name: EventNameType = "inviteDelete";

  async handle(invite: Invite) {
    this.client.invites.set(invite.guild.id, await invite.guild.fetchInvites());
  }
}
