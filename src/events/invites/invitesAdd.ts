import { GuildMember } from "discord.js";
import { InviteModel } from "../../models/invite";
import Event from "..";
import givePoints from "../../utils/points";
import countrySelector from "../../utils/countrySelector";

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
    });

    if (!inviteData) {
      await countrySelector(member, true);
      const pointsGained = await givePoints(invite.inviter, "invite");
      await InviteModel.create({
        userId: invite.inviter.id,
        invitedUserId: member.id,
        fake: false,
        pointsGained,
      });
    } else {
      await countrySelector(member, false);
      await InviteModel.create({
        userId: invite.inviter.id,
        invitedUserId: member.id,
        fake: true,
        pointsGained: 0,
      });
    }
  }
}
