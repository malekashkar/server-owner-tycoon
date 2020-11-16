import { GuildMember, TextChannel } from "discord.js";
import { InviteModel } from "../../models/invite";
import Event from "..";
import { UserModel } from "../../models/user";
import { gamePoints } from "../../utils/storage";
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

    const beenInServerBefore = await InviteModel.find({
      invitedUserId: member.id,
    });

    if (!beenInServerBefore.length) {
      const userData =
        (await UserModel.findOne({
          userId: member.id,
        })) ||
        (await UserModel.create({
          userId: member.id,
        }));

      const points = Math.floor(Math.random() * gamePoints.joinMilestone);
      userData.points += points;
      await userData.save();
    }

    if (!inviteData.length) {
      const userData =
        (await UserModel.findOne({ userId: invite.inviter.id })) ||
        (await UserModel.create({ userId: invite.inviter.id }));

      const points = Math.floor(Math.random() * gamePoints.invite);
      userData.points += points;
      await userData.save();

      const pointChannel = this.client.guilds
        .resolve(this.client.mainGuild)
        .channels.resolve(this.client.pointChannel) as TextChannel;

      pointChannel.send(
        embeds.normal(
          `Invite Points`,
          `${invite.inviter} has received \`${points}\` points for inviting **${member.user.username}**.`
        )
      );
    }
  }
}
