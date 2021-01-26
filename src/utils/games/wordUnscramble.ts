import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import randomWords from "random-words";
import Guild from "../../models/guild";
import User from "../../models/user";
import embeds from "../embeds";
import givePoints, { gameInfo } from "../../utils/points";

export default async function wordUnscramble(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>
) {
  const unscrambleData = guildData.games.wordUnscrambler;

  if (
    unscrambleData.lastTime &&
    unscrambleData.lastTime + gameInfo.wordUnscramble.cooldown < Date.now()
  ) {
    const word = randomWords();
    const shuffled = shuffle(word);
    const unscrambleWordMessage = await message.channel.send(
      embeds.normal(`Unscrambler`, `Unscramble the word \`${shuffled}\``)
    );

    unscrambleData.lastTime = Date.now();
    await guildData.save();

    const collector = await message.channel.awaitMessages(
      (m) => m.content.toLowerCase() === word.toLowerCase(),
      { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
    );

    if (collector && collector.first()) {
      const user = collector.first().author;

      await givePoints(user, "wordUnscramble");
      await unscrambleWordMessage.delete();
      await message.channel.send(
        embeds.normal(
          `You Guessed It!`,
          `${user} unscrambled the word **${shuffled}** to \`${word}\`!`
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
