import { MessageReaction, TextChannel, User } from "discord.js";
import EEvent, { EventNameType } from "..";
import { EventModel } from "../../models/event";

export default class EventAdder extends EEvent {
  name: EventNameType = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;
    const eventData = await EventModel.findOne({
      channelId: message.channel.id,
      messageId: message.id,
    });

    if (eventData && reaction.emoji.name === "✅") {
      const guild = this.client.guilds.cache.first();
      const eventChannel = guild.channels.resolve(
        eventData.eventChannelId
      ) as TextChannel;
      const member = guild.members.resolve(user);

      if (!member.permissionsIn(eventChannel).has("VIEW_CHANNEL")) {
        eventChannel.updateOverwrite(member, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: false,
        });
      }
    }
  }
}
