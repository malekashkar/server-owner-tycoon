import { MessageReaction, TextChannel, User } from "discord.js";
import Event, { EventNameType } from ".";
import { EventModel } from "../models/event";

export default class EventReactions extends Event {
  name: EventNameType = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;

    const eventData = await EventModel.findOne({
      messageId: message.id,
    });
    if (eventData && reaction.emoji.name === "✅") {
      const eventChannel = message.guild.channels.resolve(
        eventData.eventChannelId
      ) as TextChannel;
      if (eventChannel) {
        await eventChannel.updateOverwrite(user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true,
        });
      }
    }
  }
}
