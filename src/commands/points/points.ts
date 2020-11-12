import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import PointsCommand from ".";
import DbGuild from "../../models/guild";
import DbUser, { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";

export default class PointCommand extends PointsCommand {
  cmdName = "points";
  description = "Check how many points you currently have.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const user = message.mentions.users.first() || message.author;

    if (user !== message.author)
      userData =
        (await UserModel.findOne({
          userId: user.id,
        })) || (await UserModel.create({ userId: user.id }));

    message.channel.send(
      embeds.normal(
        `${user.username} Points`,
        `${user} currently has \`${userData.points}\` points.`
      )
    );
  }
}
