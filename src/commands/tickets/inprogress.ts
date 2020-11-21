import { Message, TextChannel } from "discord.js";
import TicketCommand from ".";
import { TicketModel } from "../../models/ticket";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";
import { categories } from "../../utils/storage";

export default class InProgressCommand extends TicketCommand {
  cmdName = "inprogress";
  description = "Move a ticket into the in progress category";

  async run(message: Message) {
    const confirm = await confirmation(
      `In Progress Confirmation`,
      `Are you sure you would like to move this category to in progress?`,
      message
    );

    if (confirm) {
      const channel = message.channel as TextChannel;
      const ticketData = await TicketModel.findOne({
        channelId: message.channel.id,
      });

      await ticketData.updateOne({
        $set: {
          inProgress: true,
        },
      });
      channel.setParent(categories.inProgressTickets);
      return await message.channel.send(
        embeds.normal(
          `Moving Channel`,
          `This channel has been moved and been set to an inprogress ticket.`
        )
      );
    }
  }
}