import { DocumentType } from "@typegoose/typegoose";
import { Message, TextChannel } from "discord.js";
import randomWords from "random-words";
import Guild from "../../models/guild";
import User, { UserModel } from "../../models/user";
import embeds from "../embeds";
import { gameCooldowns, gamePoints } from "../storage";

export default async function wordUnscramble(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>,
  pointChannel: TextChannel
) {
  const unscrambleData = guildData.games.wordUnscrambler;

  if (
    unscrambleData.lastTime &&
    unscrambleData.lastTime.getTime() + gameCooldowns.wordUnscramble <
      Date.now()
  ) {
    const word = randomWords();
    const shuffled = shuffle(word);
    const unscrambleWordMessage = await message.channel.send(
      embeds.normal(`Unscrambler`, `Unscramble the word \`${shuffled}\``)
    );

    unscrambleData.lastTime = new Date();
    await guildData.save();

    const collector = await message.channel.awaitMessages(
      (m) => m.content === word,
      { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
    );

    if (collector && collector.first()) {
      const points = Math.floor(Math.random() * gamePoints.wordUnscramble);
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

      await unscrambleWordMessage.delete();
      await message.channel.send(
        embeds.normal(
          `You Guessed It!`,
          `${correctUser} unscrambled the word **${shuffled}** to \`${word}\`!`
        )
      );
      await pointChannel.send(
        embeds.normal(
          `Word Unscrambled`,
          `${correctUser}, has received **${points}** points for unscrambling the word \`${word}\`.`
        )
      );
    }
  }
}

function shuffle(str: string) {
  var arr = str.split("");
  for (var i = 0; i < arr.length - 1; ++i) {
    var j = Math.floor(Math.random() * arr.length);

    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr.join("");
}
