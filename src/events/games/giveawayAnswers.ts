import { DMChannel, Message } from "discord.js";
import Event, { EventNameType } from "..";
import { GiveawayModel } from "../../models/giveaway";

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
      if (currentGiveaway.winners?.includes(message.author.id)) return;
      if (parseInt(message.content) === currentGiveaway.randomNumber) {
        await currentGiveaway.updateOne({
          $push: { winners: message.author.id },
        });
      }
    }
  }
}
