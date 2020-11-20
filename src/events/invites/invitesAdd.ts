import { GuildMember, TextChannel } from "discord.js";
import { InviteModel } from "../../models/invite";
import Event from "..";
import { UserModel } from "../../models/user";
import { gameInfo, givePoints } from "../../utils/storage";
import embeds from "../../utils/embeds";

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

    const inviteData = await InviteModel.find({
      userId: invite.inviter.id,
      invitedUserId: member.id,
    });
    if (!inviteData.length) await givePoints(invite.inviter, "invite");
  }
}
