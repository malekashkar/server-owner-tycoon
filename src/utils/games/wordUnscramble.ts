import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import randomWords from "random-words";
import Guild from "../../models/guild";
import User from "../../models/user";
import embeds from "../embeds";
import { gameCooldowns, gamePoints } from "../storage";

export default async function wordUnscramble(
  message: Message,
  userData: DocumentType<User>,
  guildData: DocumentType<Guild>
) {
  const unscrambleData = guildData.games.wordUnscrambler;

  if (
    unscrambleData &&
    unscrambleData.lastTime &&
    unscrambleData.lastTime.getTime() + gameCooldowns.wordUnscramble >
      Date.now() &&
    unscrambleData.word &&
    message.content === unscrambleData.word
  ) {
    const points = Math.floor(Math.random() * gamePoints.wordUnscramble);

    message.channel.send(
      embeds.normal(
        `Word Unscrambled`,
        `${message.author}, you received **${points}** points for unscrambling the word \`${unscrambleData.word}\`.`
      )
    );

    userData.points += points;
    await userData.save();

    unscrambleData.word = null;
    unscrambleData.lastTime = new Date();
    await guildData.save();
  }

  if (
    (unscrambleData && !unscrambleData.lastTime) ||
    (unscrambleData &&
      unscrambleData.lastTime.getTime() + gameCooldowns.wordUnscramble <
        Date.now() &&
      !unscrambleData.word)
  ) {
    const word = randomWords();
    const shuffled = shuffle(word);
    message.channel.send(
      embeds.normal(`Unscrambler`, `Unscramble the word \`${shuffled}\``)
    );

    unscrambleData.lastTime = new Date();
    unscrambleData.word = word;
    await guildData.save();
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
