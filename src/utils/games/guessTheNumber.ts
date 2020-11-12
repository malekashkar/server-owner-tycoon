import { Message, TextChannel } from "discord.js";
import embeds from "../embeds";
import User, { UserModel } from "../../models/user";
import Guild from "../../models/guild";
import { gameCooldowns, gamePoints } from "../storage";
import { DocumentType } from "@typegoose/typegoose";

export default async function GuessTheNumber(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>,
  pointChannel: TextChannel
) {
  const numberData = guildData.games.guessTheNumber;

  if (
    numberData.lastTime &&
    numberData.lastTime.getTime() + gameCooldowns.guessTheNumber < Date.now()
  ) {
    const firstNumber = randomNumber(1, 10);
    const secondNumber = randomNumber(10, 100);
    const correctNumber = randomNumber(firstNumber, secondNumber);

    const randomNumberMessage = await message.channel.send(
      embeds.normal(
        `Random Number`,
        `Guess a number between **${firstNumber}** and **${secondNumber}**.\nYou have 15 minutes to guess the number!`
      )
    );

    numberData.lastTime = new Date();
    await guildData.save();

    const collector = await message.channel.awaitMessages(
      (m) => m.content === correctNumber.toString(),
      { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
    );

    if (collector && collector.first()) {
      const points = Math.floor(Math.random() * gamePoints.guessTheNumber);
      const correctUser = collector.first().author;
      const userData =
        (await UserModel.findOne({
          userId: correctUser.id,
        })) ||
        (await UserModel.create({
          userId: correctUser.id,
        }));

      userData.points += points;
      await userData.save();

      await randomNumberMessage.delete();
      await message.channel.send(
        embeds.normal(
          `You Guessed It!`,
          `${correctUser} guess the number \`${correctNumber}\`!`
        )
      );
      await pointChannel.send(
        embeds.normal(
          `Reaction Received`,
          `${correctUser} received **${points}** points for guessing the number \`${correctNumber}\`.`
        )
      );
    }
  }
}

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * Math.floor(max));
