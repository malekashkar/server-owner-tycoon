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
    const userId = message.mentions.users.first()?.id || args[0];
    if (!userId)
      return message.channel.send(
        embeds.error(
          `Please send the id or tag the user you would like to reset!`
        )
      );
    const user = this.client.users.resolve(userId);
    if (!user)
      return message.channel.send(
        embeds.error(`The user id or tag you provided is invalid.`)
      );

    const deletedData = await UserModel.deleteOne({
      userId: user.id,
    });

    if (deletedData.deletedCount)
      return message.channel.send(
        embeds.normal(
          `User Profile Reset`,
          `${user} has been completely reset.`
        )
      );
    else
      message.channel.send(
        embeds.error(`The user does not have a registered profile.`)
      );
  }
}
