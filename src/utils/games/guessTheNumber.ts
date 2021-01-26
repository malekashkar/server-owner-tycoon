import { Message } from "discord.js";
import embeds from "../embeds";
import User from "../../models/user";
import Guild from "../../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import { getRandomIntBetween } from "../storage";
import givePoints, { gameInfo } from "../points";

export default async function GuessTheNumber(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>
) {
  const numberData = guildData.games.guessTheNumber;

  if (
    numberData.lastTime &&
    numberData.lastTime + gameInfo.guessTheNumber.cooldown < Date.now()
  ) {
    const firstNumber = getRandomIntBetween(1, 10);
    const secondNumber = getRandomIntBetween(11, 50);
    const correctNumber = getRandomIntBetween(firstNumber, secondNumber);

    const randomNumberMessage = await message.channel.send(
      embeds.normal(
        `Random Number`,
        `Guess a number between **${firstNumber}** and **${secondNumber}**.\nYou have 15 minutes to guess the number!`
      )
    );

    numberData.lastTime = Date.now();
    await guildData.save();

    const collector = message.channel.createMessageCollector(
      (m) => m.content === correctNumber.toString(),
      { max: 1, time: 15 * 60 * 1000 }
    );

    collector.on("end", async (collected) => {
      if (randomNumberMessage.deletable) await randomNumberMessage.delete();
      if (collected.size) {
        const user = collected.first().author;

        await givePoints(user, "guessTheNumber");
        await message.channel.send(
          embeds.normal(
            `You Guessed It!`,
            `${user} guess the number \`${correctNumber}\`!`
          )
        );
      } else {
      }
    });
  }
}
