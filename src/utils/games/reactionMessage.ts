import { Message, TextChannel } from "discord.js";
import embeds from "../../utils/embeds";
import { UserModel } from "../../models/user";
import Guild from "../../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import react from "../react";
import { gameInfo, givePoints } from "../storage";

export default async function reactionMessage(
  message: Message,
  guildData: DocumentType<Guild>
) {
  const reactionData = guildData.games.reactionMessage;

  if (
    reactionData.lastTime &&
    reactionData.lastTime.getTime() + gameInfo.reactionMessage.cooldown <
      Date.now()
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

    const collector = await reactionMessage.awaitReactions(
      (r, u) => r.emoji.name === "✅",
      { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
    );

    if (collector && collector.first()) {
      const user = collector
        .first()
        .users.cache.filter((x) => !x.bot)
        .first();

      await reactionMessage.delete();
      await givePoints(user, "reactionMessage");
      await message.channel.send(
        embeds.normal(
          `You Reacted First!`,
          `${user} reacted to the message the fastest!`
        )
      );
    }
  }
}
