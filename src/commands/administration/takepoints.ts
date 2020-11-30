import { Message } from "discord.js";
import AdminCommand from ".";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";

export default class TakePointsCommand extends AdminCommand {
  cmdName = "takepoints";
  description = "Take points from a player.";
  usage = "<@user> <points amount>"

  async run(message: Message, args: string[]) {
    const user = message.mentions.users.first();
    if (!user)
      return message.channel.send(
        embeds.error(`Please tag the user you would like to take points from!`)
      );

    const points = !isNaN(parseInt(args[1])) ? parseInt(args[1]) : null;
    if (!points)
      return message.channel.send(
        embeds.error(
          `Please provide the amount of points you would like to take from ${user}.`
        )
      );

    const userData =
      (await UserModel.findOne({ userId: user.id })) ||
      (await UserModel.create({ userId: user.id }));

    if (userData.points < points)
      return message.channel.send(
        embeds.error(
          `${user} only has **${userData.points} points**. You may not take **${points} points** from them!`
        )
      );

    await userData.updateOne({
      $inc: { points: -points },
    });

    return await message.channel.send(
      embeds.normal(
        `Points Taken`,
        `${message.author} has taken **${points} points** from ${user}.`
      )
    );
  }
}
