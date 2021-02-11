import { Message } from "discord.js";
import { TextInteractionModel } from "../../models/textInteraction";
import { textInteractionsConfig } from "../storage";
import givePoints from "../points";

export default async function (message: Message) {
  const interactionData = await TextInteractionModel.findOne({
    userId: message.author.id,
  });

  if (interactionData) {
    const lastMessage = (await message.channel.messages.fetch()).array()[1];
    if (
      interactionData.speakingTimes &&
      interactionData.speakingTimes > textInteractionsConfig.textStreak
    ) {
      await givePoints(message.author, "textInteraction");
      await interactionData.deleteOne();
    } else if (
      !lastMessage.author.bot &&
      lastMessage.author !== message.author &&
      (!interactionData.lastSpeakingTime ||
        Date.now() - interactionData.lastSpeakingTime >
          textInteractionsConfig.resetInterval)
    ) {
      interactionData.speakingTimes += 1;
      interactionData.lastSpeakingTime = Date.now();
      await interactionData.save();
    }
  } else {
    await TextInteractionModel.create({
      userId: message.author.id,
      speakingTimes: 0,
    });
  }
}
