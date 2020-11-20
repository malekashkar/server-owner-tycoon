import { Message, TextChannel } from "discord.js";
import embeds from "../embeds";
import User, { UserModel } from "../../models/user";
import Guild from "../../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import { gameInfo, givePoints, getRandomIntBetween } from "../storage";

export default async function GuessTheNumber(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>,
) {
  const numberData = guildData.games.guessTheNumber;

  if (
    numberData.lastTime &&
    numberData.lastTime.getTime() + gameInfo.guessTheNumber.cooldown <
      Date.now()
  ) {
    const firstNumber = getRandomIntBetween(1, 10);
    const secondNumber = getRandomIntBetween(10, 100);
    const correctNumber = getRandomIntBetween(firstNumber, secondNumber);

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
      const user = collector.first().author;

      await givePoints(user, "guessTheNumber");
      await randomNumberMessage.delete();
      await message.channel.send(
        embeds.normal(
          `You Guessed It!`,
          `${user} guess the number \`${correctNumber}\`!`
        )
      );
    }
  }
}
