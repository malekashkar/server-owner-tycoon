import { Message } from "discord.js";
import AdminCommand from ".";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";
import { msToFormattedTime, roles } from "../../utils/storage";
import ms from "ms";
import { EventModel } from "../../models/event";

export default class EventCommand extends AdminCommand {
  cmdName = "event";
  description = "Create an event which has a countdown to the start.";

  async run(message: Message) {
    const channel = await getChannel(
      message,
      `Tag the channel you would like to post the event joiner in.`
    );
    if (!channel) return;

    const eventChannel = await getChannel(
      message,
      `Tag the event channel that users will get access to upon reacting.`
    );
    if (!eventChannel) return;

    const title = await getText(
      message,
      `What is the title/name of the event?`
    );
    if (!title) return;

    const description = await getText(
      message,
      `What is the description of the event?`
    );
    if (!description) return;

    const lastTime = await getText(
      message,
      `In how long will this event start? (ex. 2h, 3d, 1w)`
    );
    if (!lastTime) return;
    const startsAt = new Date(Date.now() + ms(lastTime));

    const embed = embeds
      .normal(title, description)
      .addField(
        `⏱️ Starts In`,
        `**${msToFormattedTime(startsAt.getTime() - Date.now())}**`
      );
    const testEmbed = await message.channel.send(embed);

    const confirm = await confirmation(
      `Event Confirmation`,
      `Are you sure you would like to post this event?`,
      message
    );

    if (confirm) {
      if (testEmbed.deletable) await testEmbed.delete();
      const eventMessage = await channel.send(`<@&${roles.events}>`, embed);
      await eventMessage.react("✅");

      await EventModel.create({
        starterId: message.author.id,
        channelId: channel.id,
        messageId: eventMessage.id,
        eventChannelId: eventChannel.id,
        name: title,
        startsAt,
      });
    } else {
      if (testEmbed.deletable) await testEmbed.delete();
    }
  }
}

async function getChannel(message: Message, question: string) {
  const questionmsg = await message.channel.send(embeds.question(question));
  const collector = await message.channel.awaitMessages(
    (x: Message) =>
      x.author.id === message.author.id && x.mentions.channels.size >= 1,
    {
      max: 1,
      time: 15 * 60 * 1000,
      errors: ["time"],
    }
  );
  if (collector.first()) {
    if (questionmsg.deletable) await questionmsg.delete();
    return collector.first().mentions.channels.first();
  } else {
    return null;
  }
}

async function getText(message: Message, question: string) {
  const questionmsg = await message.channel.send(embeds.question(question));
  const collector = await message.channel.awaitMessages(
    (x: Message) => x.author.id === message.author.id,
    {
      max: 1,
      time: 15 * 60 * 1000,
      errors: ["time"],
    }
  );
  if (collector.first()) {
    if (questionmsg.deletable) await questionmsg.delete();
    return collector.first().content;
  } else {
    return null;
  }
}
