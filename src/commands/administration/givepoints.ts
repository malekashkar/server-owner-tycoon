import { Message } from "discord.js";
import AdminCommand from ".";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";

export default class GivePointsCommand extends AdminCommand {
  cmdName = "givepoints";
  description = "Give points to a player.";

  async run(message: Message, args: string[]) {
    const user = message.mentions.users.first();
    if (!user)
      return message.channel.send(
        embeds.error(`Please tag the user you would like to give points to!`)
      );

    const points = !isNaN(parseInt(args[1])) ? parseInt(args[1]) : null;
    if (!points)
      return message.channel.send(
        embeds.error(
          `Please provide the amount of points you would like to give ${user}.`
        )
      );

    const userData =
      (await UserModel.findOne({ userId: user.id })) ||
      (await UserModel.create({ userId: user.id }));

    await userData.updateOne({
      $inc: { points },
    });

    return await message.channel.send(
      embeds.normal(
        `Points Given`,
        `${message.author} has given ${user} **${points} points**.`
      )
    );
  }
}
