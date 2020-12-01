import { MessageReaction, TextChannel, User } from "discord.js";
import EEvent, { EventNameType } from "..";
import { EventModel } from "../../models/event";

export default class EventAdder extends EEvent {
  name: EventNameType = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;

    if (reaction.emoji.name === "✅") {
      const eventData = await EventModel.findOne({
        channelId: message.channel.id,
        messageId: message.id,
      });
      if (eventData) {
        const eventChannel = message.guild.channels.resolve(
          eventData.eventChannelId
        ) as TextChannel;
        const member = message.guild.members.resolve(user);

        if (!member.permissionsIn(eventChannel).has("VIEW_CHANNEL")) {
          eventChannel.updateOverwrite(member, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: false,
          });
        }
      }
    }
  }
}
