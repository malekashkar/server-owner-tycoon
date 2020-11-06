import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from ".";
import Guild from "../models/guild";
import Invite, { IInvite, InviteModel } from "../models/invite";
import User, { UserModel } from "../models/user";
import Client from "../structures/client";
import embeds from "../utils/embeds";

export default class InvitesCommand extends Command {
  cmdName = "invites";
  description = "Check how much invites you have.";

  async run(
    client: Client,
    message: Message,
    args: string[],
    userData: DocumentType<User>,
    guildData: DocumentType<Guild>
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

function inviteProcessor(invites: DocumentType<Invite>[]) {
  let realInvites: IInvite[] = [];
  let fakeInvites: number = 0;
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

  console.log(realInvites, fakeInvites);

  return fakeInvites;
}
