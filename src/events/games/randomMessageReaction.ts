import Event from "..";
import { MessageReaction, User } from "discord.js";
import embeds from "../../utils/embeds";
import { UserModel } from "../../models/user";
import { gameCooldowns, gamePoints } from "../../utils/storage";
import Client from "../../structures/client";

export default class randomMessageReaction extends Event {
  name = "messageReactionAdd";

  async handle(client: Client, reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;

    const userData =
      (await UserModel.findOne({ userId: user.id })) ||
      (await UserModel.create({
        userId: user.id,
      }));

    if (
      !userData.gameCooldowns ||
      !userData.gameCooldowns.randomMessageReaction
    ) {
      const points = Math.floor(Math.random() * gamePoints.guessTheNumber);

      userData.points += points;
      userData.gameCooldowns = { randomMessageReaction: new Date() };
      await userData.save();

      message.channel.send(
        embeds.normal(
          `Reaction Points`,
          `You received **${points}** for reacting to a message!`
        )
      );
    } else if (
      !userData.gameCooldowns.randomMessageReaction ||
      (userData.gameCooldowns.randomMessageReaction &&
        userData.gameCooldowns.randomMessageReaction.getTime() +
          gameCooldowns.randomMessageReaction <
          Date.now())
    ) {
      const points = Math.floor(Math.random() * gamePoints.guessTheNumber);

      userData.points += points;
      userData.gameCooldowns.randomMessageReaction = new Date();
      await userData.save();

      message.channel.send(
        embeds.normal(
          `Reaction Points`,
          `You received **${points}** for reacting to a message!`
        )
      );
    }
  }
}
