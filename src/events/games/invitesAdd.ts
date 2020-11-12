import { GuildMember, TextChannel } from "discord.js";
import { InviteModel } from "../../models/invite";
import Event from "..";
import { UserModel } from "../../models/user";
import { countries, emojis, gamePoints } from "../../utils/storage";
import embeds from "../../utils/embeds";
import { GuildModel } from "../../models/guild";
import { TextChange } from "typescript";

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

    await InviteModel.create({
      userId: invite.inviter.id,
      invitedUserId: member.id,
    });

    const guildData =
      (await GuildModel.findOne({ guildId: member.guild.id })) ||
      (await GuildModel.create({ guildId: member.guild.id }));
    if (guildData.joinCategory) {
      const formattedUsername =
        member.user.username.length > 15
          ? member.user.username.slice(0, 15)
          : member.user.username;
      const channel = await member.guild.channels.create(
        `${formattedUsername}-entrance`,
        {
          type: "text",
          parent: guildData.joinCategory,
          permissionOverwrites: [
            {
              id: member.id,
              allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"],
            },
            {
              id: member.guild.id,
              deny: "VIEW_CHANNEL",
            },
          ],
        }
      );
      const continentEmbed = embeds.normal(
        `Select A Continent`,
        `Please select one of the following continents: ${Object.entries(
          countries
        ).map((x, i) => `${emojis[i]} ${x}`)}`
      );

      const continentMessage = await channel.send(continentEmbed);
    }
  }
}
