import { DMChannel, Message } from "discord.js";
import Event, { EventNameType } from "..";
import { GiveawayModel } from "../../models/giveaway";

export default class GiveawayAnswers extends Event {
  name: EventNameType = "message";

  async handle(message: Message) {
    console.log(
      !isNaN(parseInt(message.content)),
      message.channel instanceof DMChannel
    );
    if (
      message.channel instanceof DMChannel &&
      !isNaN(parseInt(message.content))
    ) {
      const currentGiveaway = await GiveawayModel.findOne({
        endsAt: { $gte: new Date() },
        ended: false,
      });
      if (currentGiveaway.winners?.includes(message.author.id)) return;
      if (!currentGiveaway.participants?.includes(message.author.id))
        currentGiveaway.participants.push(message.author.id);
      if (parseInt(message.content) === currentGiveaway.randomNumber)
        currentGiveaway.winners.push(message.author.id);
      await currentGiveaway.save();
    }
  }
}
