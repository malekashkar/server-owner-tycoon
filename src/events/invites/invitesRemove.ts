import { GuildMember, Invite } from "discord.js";
import Event from "..";
import { InviteModel } from "../../models/invite";
import { UserModel } from "../../models/user";

export default class removeInvites extends Event {
  name = "guildMemberRemove";

  async handle(member: GuildMember) {
    await UserModel.deleteOne({
      userId: member.id,
    });

    const inviteData = await InviteModel.findOne({
      invitedUserId: member.id,
    });
    if (inviteData) {
      const userData = await UserModel.findOne({
        userId: inviteData.userId,
      });
      if (
        inviteData.pointsGained &&
        userData.points >= inviteData.pointsGained
      ) {
        userData.points -= inviteData.pointsGained;
        await userData.save();
      } else {
        userData.points = 0;
        await userData.save();
      }
      await inviteData.deleteOne();
    }

    this.client.invites.set(member.guild.id, await member.guild.fetchInvites());
  }
}
