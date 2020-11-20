import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import PointsCommand from ".";
import DbGuild from "../../models/guild";
import DbUser, { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";

export default class GiftCommand extends PointsCommand {
  cmdName = "gift";
  description = "Gift your credits to others.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const giftTo = message.mentions.users.first();
    if (!giftTo)
      return message.channel.send(
        embeds.error(`Please tag the user you would like to gift points to.`)
      );

    if (message.author === giftTo)
      return message.channel.send(
        embeds.error(`You are not allowed to gift points to yourself!`)
      );

    const amount = parseInt(args[1]);
    if (!amount || isNaN(amount))
      return message.channel.send(
        embeds.error(
          `Please provide the amount of points you would like to gift to ${giftTo}.`
        )
      );

    if (userData.points < amount)
      return message.channel.send(
        embeds.error(`You don't have \`${amount}\` points to gift ${giftTo}.`)
      );

    const giftToData =
      (await UserModel.findOne({
        userId: giftTo.id,
      })) ||
      (await UserModel.create({
        userId: giftTo.id,
      }));

    giftToData.points += amount;
    userData.points -= amount;
    await giftToData.save();
    await userData.save();

    message.channel.send(
      embeds.normal(
        `Gift Sent`,
        `${message.author} has gifted \`${amount}\` points to ${giftTo}.`
      )
    );
  }
}
