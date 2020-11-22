import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import PointsCommand from ".";
import DbGuild from "../../models/guild";
import { TicketModel } from "../../models/ticket";
import DbUser, { UserModel } from "../../models/user";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";
import { categories, emojis, prizes } from "../../utils/storage";

export default class PrizesCommand extends PointsCommand {
  cmdName = "prizes";
  description = "Check what prizes you can get for your points.";

  async run(message: Message, args: string[], userData: DocumentType<DbUser>) {
    const prizeTitles = Object.keys(prizes);
    const prizeValues = Object.values(prizes);

    const categoryEmbed = embeds.empty().setTitle(`Prize Categories`);
    for (let i = 0; i < prizeTitles.length; i++) {
      const prizeType = prizeTitles[i];
      const value = prizeValues[i];

      const formattedValues = Object.entries(value)
        .map((x) => `• ${x[0]} ~ **${x[1]}** points`)
        .join("\n");

      categoryEmbed.addField(`${emojis[i]} ${prizeType}`, formattedValues);
    }

    const categoryEmojis = emojis.slice(0, prizeTitles.length);
    const categoryMessage = await message.channel.send(categoryEmbed);
    const categoryCollector = await categoryMessage.awaitReactions(
      (r, u) =>
        u.id === message.author.id && categoryEmojis.includes(r.emoji.name),
      {
        max: 1,
        time: 15 * 60 * 1000,
        errors: ["time"],
      }
    );

    if (categoryCollector && categoryCollector.first()) {
      if (categoryMessage.deletable) await categoryMessage.delete();

      const categoryPrizes =
        prizeValues[
          categoryEmojis.indexOf(categoryCollector.first().emoji.name)
        ];
      const selectedPrizes = Object.entries(categoryPrizes);
      const prizeEmojis = emojis.slice(selectedPrizes.length);
      const prizeDescription = selectedPrizes
        .map((x, i) => `${prizeEmojis[i]} ${x[0]} ~ **${x[1]}** points`)
        .join("\n");
      const prizeEmbed = embeds.normal(`Prizes`, prizeDescription);
      const prizeMessage = await message.channel.send(prizeEmbed);
      const prizeCollector = await prizeMessage.awaitReactions(
        (r, u) =>
          u.id === message.author.id && prizeEmojis.includes(r.emoji.name),
        {
          max: 1,
          time: 15 * 60 * 1000,
          errors: ["time"],
        }
      );

      if (prizeCollector && prizeCollector.first()) {
        if (prizeMessage.deletable) await prizeMessage.delete();

        const prizePrice =
          selectedPrizes[
            prizeEmojis.indexOf(prizeCollector.first().emoji.name)
          ][1];
        const chosenPrize =
          selectedPrizes[
            prizeEmojis.indexOf(prizeCollector.first().emoji.name)
          ][0];

        if (userData.points < prizePrice)
          return message.channel.send(
            embeds.error(
              `You don't have enough points to afford \`${chosenPrize}\`.`
            )
          );

        const confirm = await confirmation(
          `Prize Redeem Confirmation`,
          `Are you sure you would like to redeem \`${chosenPrize}\` for **${prizePrice}** points?`,
          message
        );

        if (confirm) {
          await UserModel.updateOne(
            {
              _id: userData._id,
            },
            {
              $inc: { points: -prizePrice },
            }
          );

          const ticketType = ["claim", "💳"];
          const username =
            message.author.username.length < 15
              ? message.author.username
              : message.author.username.slice(0, 15);
          const channel = await message.guild.channels.create(
            `${ticketType[1]}${ticketType[0]}-${username}`,
            {
              type: "text",
              parent: categories.tickets,
              permissionOverwrites: [
                {
                  id: message.author.id,
                  allow: [
                    "SEND_MESSAGES",
                    "READ_MESSAGE_HISTORY",
                    "VIEW_CHANNEL",
                  ],
                },
                {
                  id: message.guild.id,
                  deny: "VIEW_CHANNEL",
                },
              ],
              reason: `${message.author.username} is claiming a prize.`,
            }
          );

          await channel.send(
            embeds.normal(
              `Hey ${username}!`,
              `Administrators will be right with you to help you claim your \`${chosenPrize}\` reward!`
            )
          );

          await TicketModel.create({
            userId: message.author.id,
            channelId: channel.id,
          });
        }
      } else {
        if (prizeMessage.deletable) await prizeMessage.delete();
      }
    } else {
      if (categoryMessage.deletable) await categoryMessage.delete();
    }
  }
}
