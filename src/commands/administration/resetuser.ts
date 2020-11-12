import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser, { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";

export default class ResetUser extends AdminCommand {
  cmdName = "resetuser";
  description = "Reset a users entire profile";
  permission = "administrator";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const user = message.mentions.users.first();
    if (!user)
      return message.channel.send(
        embeds.error(`Please tag the user you would like to reset!`)
      );

    await UserModel.deleteOne({
      userId: user.id,
    });

    message.channel.send(
      embeds.normal(`User Profile Reset`, `${user} has been completely reset.`)
    );
  }
}
