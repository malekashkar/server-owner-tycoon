import { Message, TextChannel } from "discord.js";
import { TicketModel } from "../../models/ticket";
import { categories } from "../../utils/storage";

export default async function SaveTicketMessages(message: Message) {
  if (
    (message.channel as TextChannel).parentID !== categories.tickets &&
    (message.channel as TextChannel).parentID !== categories.inProgressTickets
  )
    return;
  if (!message.content || message.embeds[0]) return;

  await TicketModel.updateOne(
    {
      channelId: message.channel.id,
    },
    {
      $push: {
        messages: {
          content: message.content,
          userTag: message.author.tag,
          sentAt: message.createdAt,
        },
      },
    }
  );
}
