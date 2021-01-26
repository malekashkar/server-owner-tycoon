import { GuildMember } from "discord.js";
import { InviteModel } from "../../models/invite";
import Event from "..";
import givePoints from "../../utils/points";

export default class addInvites extends Event {
  name = "guildMemberAdd";

  async handle(member: GuildMember) {
    const guildInvites = await member.guild.fetchInvites();
    const ei = this.client.invites.get(member.guild.id);
    this.client.invites.set(member.guild.id, guildInvites);

    const invite = guildInvites.find((i) => {
      if (ei.get(i.code) && ei.get(i.code).uses)
        return ei.get(i.code).uses < i.uses;
    });
    if (!invite?.inviter || invite?.inviter === member.user) return;

    const inviteData = await InviteModel.findOne({
      userId: invite.inviter.id,
      invitedUserId: member.id,
      fake: false,
    });

    if (!inviteData) {
      await givePoints(member.user, "invite");
      await InviteModel.create({
        userId: invite.inviter.id,
        invitedUserId: member.id,
      });
    } else {
      await InviteModel.create({
        userId: invite.inviter.id,
        invitedUserId: member.id,
        fake: true,
      });
    }
  }
}
