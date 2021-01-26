import { Message } from "discord.js";
import embeds from "../../utils/embeds";
import Guild from "../../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import react from "../react";
import givePoints, { gameInfo } from "../../utils/points";

export default async function reactionMessage(
  message: Message,
  guildData: DocumentType<Guild>
) {
  const reactionData = guildData.games.reactionMessage;

  if (
    (reactionData.lastTime &&
      reactionData.lastTime.getTime() + gameInfo.reactionMessage.cooldown <
        Date.now()) ||
    !reactionData.lastTime
  ) {
    const reactionMessage = await message.channel.send(
      embeds.normal(
        `First Reaction`,
        `The first person to react to this message will receive points!\nYou have 15 minutes before this message is gone.`
      )
    );
    await react(reactionMessage, ["✅"]);

    reactionData.lastTime = new Date();
    await guildData.save();

    const collector = reactionMessage.createReactionCollector(
      (r, u) => r.emoji.name === "✅",
      { max: 1, time: 15 * 60 * 1000 }
    );

    collector.on("end", async (collected) => {
      if (reactionMessage.deletable) await reactionMessage.delete();
      if (collected.size) {
        const user = collected
          .first()
          .users.cache.filter((x) => !x.bot)
          .first();

        await givePoints(user, "reactionMessage");
        await message.channel.send(
          embeds.normal(
            `You Reacted First!`,
            `${user} reacted to the message the fastest!`
          )
        );
      }
    });
  }
}
