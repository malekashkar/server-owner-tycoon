import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import UtilityCommand from ".";
import DbGuild from "../../models/guild";
import DbInvite, { IInvite, InviteModel } from "../../models/invite";
import DbUser, { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";

export default class InvitesCommand extends UtilityCommand {
  cmdName = "invites";
  description = "Check how much invites you have.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const user = message.mentions.users.first() || message.author;

    if (user !== message.author)
      userData =
        (await UserModel.findOne({ userId: user.id })) ||
        (await UserModel.create({ userId: user.id }));

    const invitesData = await InviteModel.find({
      userId: user.id,
    });
    const invites = inviteProcessor(invitesData);

    message.channel.send(
      embeds.normal(
        `${user.username} Invites`,
        `${user} currently has \`${invitesData.length}\` invites.${
          invites ? ` | Fake Invites: **${invites}**` : ``
        }`
      )
    );
  }
}

function inviteProcessor(invites: DocumentType<DbInvite>[]) {
  let realInvites: IInvite[] = [];
  let fakeInvites = 0;
  for (let i = 0; i < invites.length; i++) {
    if (
      !realInvites.some(
        (x) =>
          x.userId === invites[i].userId &&
          x.inviteUserId === invites[i].invitedUserId
      )
    )
      realInvites.push({
        userId: invites[i].userId,
        inviteUserId: invites[i].invitedUserId,
      });
    else fakeInvites++;
  }

  return fakeInvites;
}
