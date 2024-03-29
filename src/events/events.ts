import { DocumentType } from "@typegoose/typegoose";
import { TextChannel } from "discord.js";
import EEvent, { EventNameType } from ".";
import { EventModel } from "../models/event";
import embeds from "../utils/embeds";
import { formatTime, roles } from "../utils/storage";
import { Event } from "../models/event";

export default class EventChecker extends EEvent {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      const ongoingEventCursor = EventModel.find({
        startsAt: { $gt: new Date() },
      }).cursor();
      const startedEvents = EventModel.find({
        startsAt: { $lte: new Date() },
      }).cursor();

      ongoingEventCursor.on("data", async (event: DocumentType<Event>) => {
        const channel = guild.channels.resolve(event.channelId) as TextChannel;
        if (channel) {
          const message = await channel.messages.fetch(event.messageId);
          if (message) {
            const embed = message.embeds[0];
            embed.fields[0] = {
              name: `⏱️ Starts In`,
              value: `**${formatTime(event.startsAt.getTime() - Date.now())}**`,
              inline: false,
            };
            await message.edit(embed);
          }
        }
      });

      startedEvents.on("data", async (event: DocumentType<Event>) => {
        const channel = guild.channels.resolve(event.channelId) as TextChannel;
        if (channel) {
          const message = await channel.messages.fetch(event.messageId);
          if (message?.deletable) await message.delete();
        }

        const eventChannel = guild.channels.resolve(
          event.eventChannelId
        ) as TextChannel;
        if (eventChannel) {
          await eventChannel?.send(
            `<@&${roles.events}>`,
            embeds.normal(
              `Event Started`,
              `The event \`${event.name}\` has started!`
            )
          );
          await event.deleteOne();
        }
      });
    }, 10 * 1000);
  }
}
