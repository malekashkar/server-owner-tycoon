import { UserModel } from "../../models/user";
import { Message, TextChannel } from "discord.js";
import { gamePoints } from "../storage";
import embeds from "../embeds";

function isServerBoostMessage(message: Message) {
  return (
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION" ||
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" ||
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" ||
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"
  );
}

export default async function guildBoosts(
  message: Message,
  pointChannel: TextChannel
) {
  if (message.system && isServerBoostMessage(message)) {
    const userData =
      (await UserModel.findOne({ userId: message.author.id })) ||
      (await UserModel.create({ userId: message.author.id }));

    const points = Math.floor(Math.random() * gamePoints.guildBoost);
    userData.points += points;
    await userData.save();

    pointChannel.send(
      embeds.normal(
        `Server Boost Points`,
        `${message.author} has received **${points}** for boosting **${message.guild.name}**!`
      )
    );
  }
}
