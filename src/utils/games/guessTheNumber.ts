import { Message } from "discord.js";
import embeds from "../embeds";
import User from "../../models/user";
import Guild from "../../models/guild";
import { gameCooldowns, gamePoints } from "../storage";
import { DocumentType } from "@typegoose/typegoose";

export default async function GuessTheNumber(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>
) {
  const numberData = guildData.games.guessTheNumber;

  if (
    numberData.number &&
    numberData.lastTime &&
    numberData.lastTime.getTime() + gameCooldowns.guessTheNumber > Date.now()
  ) {
    if (
      parseInt(message.content) &&
      parseInt(message.content) === numberData.number
    ) {
      const points = Math.floor(Math.random() * gamePoints.guessTheNumber);
      message.channel.send(
        embeds.normal(
          `Random Number Found`,
          `${message.author} received **${points}** points for guessing the number \`${numberData.number}\`.`
        )
      );

      userData.points += points;
      await userData.save();

      numberData.number = null;
      numberData.lastTime = new Date();
      await guildData.save();
    }
  }

  if (
    !numberData.lastTime ||
    (numberData.lastTime.getTime() + gameCooldowns.guessTheNumber <
      Date.now() &&
      !numberData.number)
  ) {
    const firstNumber = randomNumber(1, 10);
    const secondNumber = randomNumber(10, 100);

    message.channel.send(
      embeds.normal(
        `Random Number`,
        `Guess a number between **${firstNumber}** and **${secondNumber}**.`
      )
    );

    numberData.lastTime = new Date();
    numberData.number = randomNumber(firstNumber, secondNumber);
    await guildData.save();
  }
}

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * Math.floor(max));
