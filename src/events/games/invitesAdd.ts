import Client from "../../structures/client";
import { GuildMember } from "discord.js";
import { InviteModel } from "../../models/invite";
import Event from "..";
import { UserModel } from "../../models/user";
import { gamePoints } from "../../utils/storage";
import embeds from "../../utils/embeds";

export default class addInvites extends Event {
  name = "guildMemberAdd";

  async handle(client: Client, member: GuildMember) {
    const guildInvites = await member.guild.fetchInvites();
    const ei = client.invites.get(member.guild.id);
    client.invites.set(member.guild.id, guildInvites);

    const invite = guildInvites.find((i) => {
      if (ei.get(i.code) && ei.get(i.code).uses)
        return ei.get(i.code).uses < i.uses;
    });

    const inviteData = await InviteModel.find({
      userId: invite.inviter.id,
      invitedUserId: member.id,
    });

    if (!inviteData.length) {
      const userData =
        (await UserModel.findOne({ userId: invite.inviter.id })) ||
        (await UserModel.create({ userId: invite.inviter.id }));

      const points = Math.floor(Math.random() * gamePoints.invite);
      userData.points += points;
      await userData.save();

      invite.inviter
        .send(
          embeds.normal(
            `Invite Points`,
            `You received \`${points}\` points for inviting **${member.user.username}**.`
          )
        )
        .catch(() => undefined);
    }

    await InviteModel.create({
      userId: invite.inviter.id,
      invitedUserId: member.id,
    });
  }
}
