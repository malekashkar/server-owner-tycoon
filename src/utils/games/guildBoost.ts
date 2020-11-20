import { Message } from "discord.js";
import { givePoints } from "../storage";

function isServerBoostMessage(message: Message) {
  return (
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION" ||
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1" ||
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2" ||
    message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3"
  );
}

export default async function guildBoosts(message: Message) {
  if (message.system && isServerBoostMessage(message))
    await givePoints(message.author, "guildBoost");
}
