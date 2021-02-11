import { Message } from "discord.js";
import { TextInteractionModel } from "../../models/textInteraction";
import { textInteractionsConfig } from "../storage";
import givePoints from "../points";

export default async function (message: Message) {
  const interactionData = await TextInteractionModel.findOne({
    userId: message.author.id,
  });

  if (interactionData) {
    console.log(`Interation Step 1`);
    if (interactionData.speakingTimes > textInteractionsConfig.textStreak) {
      console.log(`Interation Completed`);
      await givePoints(message.author, "textInteraction");
      await interactionData.deleteOne();
    } else if (
      !message.channel.lastMessage.author.bot &&
      message.channel.lastMessage.author !== message.author &&
      interactionData.lastSpeakingTime - Date.now() >
        textInteractionsConfig.resetInterval
    ) {
      console.log(`Interation Step 3`);
      await TextInteractionModel.updateOne(
        {
          userId: message.author.id,
        },
        {
          $inc: { userSpeakingTimes: 1 },
        }
      );
    }
  } else {
    console.log(`Interation Step 2`);
    await TextInteractionModel.create({
      userId: message.author.id,
      speakingTimes: 0,
    });
  }
}
