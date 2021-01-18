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

function serverBoostAmount(message: Message) {
  if (message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION") return 1;
  if (message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1") return 1;
  if (message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2") return 3;
  if (message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3") return 3;
  return 1;
}

export default async function guildBoosts(message: Message) {
  if (message.system && isServerBoostMessage(message)) {
    const amount = serverBoostAmount(message);
    for (let i = 0; i < amount; i++) {
      await givePoints(message.author, "guildBoost");
    }
  }
}
