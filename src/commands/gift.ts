import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from ".";
import Guild from "../models/guild";
import User, { UserModel } from "../models/user";
import Client from "../structures/client";
import embeds from "../utils/embeds";

export default class GiftCommand extends Command {
  cmdName = "gift";
  description = "Gift your credits to others.";

  async run(
    client: Client,
    message: Message,
    args: string[],
    userData: DocumentType<User>,
    guildData: DocumentType<Guild>
  ) {
    const giftTo = message.mentions.users.first();
    if (!giftTo)
      return message.channel.send(
        embeds.error(`Please tag the user you would like to gift points to.`)
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
