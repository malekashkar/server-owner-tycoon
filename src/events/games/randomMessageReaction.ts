import Event from "..";
import { MessageReaction, TextChannel, User } from "discord.js";
import { UserModel } from "../../models/user";
import givePoints, { gameInfo } from "../../utils/points";

export default class randomMessageReaction extends Event {
  name = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (!(reaction.message.channel instanceof TextChannel)) return;

    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const userData =
      (await UserModel.findOne({ userId: user.id })) ||
      (await UserModel.create({
        userId: user.id,
      }));

    if (
      !userData.gameCooldowns ||
      !userData.gameCooldowns.randomMessageReaction
    ) {
      await givePoints(user, "randomMessageReaction");
      userData.gameCooldowns = { randomMessageReaction: new Date() };
      await userData.save();
    } else if (
      !userData.gameCooldowns.randomMessageReaction ||
      (userData.gameCooldowns.randomMessageReaction &&
        userData.gameCooldowns.randomMessageReaction.getTime() +
          gameInfo.randomMessageReaction.cooldown <
          Date.now())
    ) {
      await givePoints(user, "randomMessageReaction");
      userData.gameCooldowns.randomMessageReaction = new Date();
      await userData.save();
    }
  }
}
