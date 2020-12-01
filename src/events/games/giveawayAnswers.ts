import { DMChannel, Message } from "discord.js";
import Event, { EventNameType } from "..";
import { GiveawayModel } from "../../models/giveaway";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class GiveawayAnswers extends Event {
  name: EventNameType = "message";

  async handle(message: Message) {
    if (
      message.channel instanceof DMChannel &&
      !isNaN(parseInt(message.content))
    ) {
      const currentGiveaway = await GiveawayModel.findOne({
        endsAt: { $gte: new Date() },
        ended: false,
      });
      if (!currentGiveaway.participants?.includes(message.author.id)) {
        const guessedNumber = parseInt(message.content);
        if (guessedNumber < 1 || guessedNumber > 100) {
          message.channel.send(
            embeds.error(`Please provide a number from 1-100.`)
          );
        } else {
          const confirm = await confirmation(
            `Number Choice Confirmation`,
            `Are you sure you would like to choose the number ${guessedNumber}?`
          );
          if (!confirm) return;

          currentGiveaway.participants.push(message.author.id);
          if (guessedNumber === currentGiveaway.randomNumber)
            currentGiveaway.winners.push(message.author.id);
          await currentGiveaway.save();
        }
      }
    }
  }
}
