import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from ".";
import Guild from "../models/guild";
import User, { UserModel } from "../models/user";
import Client from "../structures/client";
import embeds from "../utils/embeds";

export default class PointCommand extends Command {
  cmdName = "points";
  description = "Check how many points you currently have.";

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
