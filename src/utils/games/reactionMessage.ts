import { Message, TextChannel } from "discord.js";
import embeds from "../../utils/embeds";
import User, { UserModel } from "../../models/user";
import Guild from "../../models/guild";
import { gameCooldowns, gamePoints } from "../../utils/storage";
import { DocumentType } from "@typegoose/typegoose";
import react from "../react";

export default async function reactionMessage(
  message: Message,
  guildData: DocumentType<Guild>,
  pointChannel: TextChannel
) {
  const reactionData = guildData.games.reactionMessage;

  if (
    reactionData.lastTime &&
    reactionData.lastTime.getTime() + gameCooldowns.reactionMessage < Date.now()
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
      const points = Math.floor(Math.random() * gamePoints.reactionMessage);
      const reactedUser = collector.first().users.cache.array()[1];
      const userData =
        (await UserModel.findOne({
          userId: reactedUser.id,
        })) ||
        (await UserModel.create({
          userId: reactedUser.id,
        }));

      userData.points += points;
      await userData.save();

      await reactionMessage.delete();
      await pointChannel.send(
        embeds.normal(
          `Reaction Received`,
          `${message.author} received **${points}** for clicking the emoji first.`
        )
      );
    }
  }
}
