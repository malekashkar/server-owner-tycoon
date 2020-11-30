import { Message } from "discord.js";
import Event, { EventNameType } from ".";
import { TextInteractionModel } from "../models/textInteraction";
import { givePoints } from "../utils/storage";

export default class StartTextInteraction extends Event {
  name: EventNameType = "message";

  async handle(message: Message) {
    if (message.author.bot) return;

    const interactionData = await TextInteractionModel.findOne({
      userId: message.author.id,
    });

    if (interactionData) {
      if (interactionData.speakingTimes < 3) {
        await givePoints(message.author, "textInteraction");
        await interactionData.deleteOne();
      } else if (
        !message.channel.lastMessage.author.bot &&
        message.channel.lastMessage.author !== message.author &&
        interactionData.lastSpeakingTime - Date.now() > 30 * 1000
      ) {
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
      await TextInteractionModel.create({
        userId: message.author.id,
        speakingTimes: 0,
      });
    }
  }
}
