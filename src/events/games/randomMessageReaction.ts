import Event from "..";
import { MessageReaction, TextChannel, User } from "discord.js";
import embeds from "../../utils/embeds";
import { UserModel } from "../../models/user";
import { gameCooldowns, gamePoints } from "../../utils/storage";

export default class randomMessageReaction extends Event {
  name = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const pointChannel = this.client.guilds
      .resolve(this.client.mainGuild)
      .channels.resolve(this.client.pointChannel) as TextChannel;

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

      pointChannel.send(
        embeds.normal(
          `Reaction Points`,
          `${user} has received **${points}** for reacting to a message!`
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

      pointChannel.send(
        embeds.normal(
          `Reaction Points`,
          `${user} has received **${points}** for reacting to a message!`
        )
      );
    }
  }
}
