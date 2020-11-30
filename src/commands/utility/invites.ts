import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import UtilityCommand from ".";
import DbGuild from "../../models/guild";
import { InviteModel } from "../../models/invite";
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
    const invites = await InviteModel.countDocuments({
      userId: user.id,
      fake: false,
    });
    const fakeInvites = await InviteModel.countDocuments({
      userId: user.id,
      fake: true,
    });

    return await message.channel.send(
      embeds.normal(
        `${user.username} Invites`,
        `${user} currently has \`${invites}\` invites.${
          fakeInvites ? ` | Fake Invites: **${fakeInvites}**` : ``
        }`
      )
    );
  }
}
