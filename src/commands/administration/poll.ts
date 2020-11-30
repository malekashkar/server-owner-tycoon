import { Message } from "discord.js";
import AdminCommand from ".";
import { PollModel } from "../../models/poll";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";
import { reactionRoles, roles } from "../../utils/storage";
import ms from "ms";
import { emojis } from "../../utils/storage";
import react from "../../utils/react";

export default class PollCommand extends AdminCommand {
  cmdName = "poll";
  description = "Create a poll for users opinions on a question.";

  async run(message: Message) {
    const channel = await getChannel(message);
    if (!channel) return;

    const question = await getText(
      message,
      `What is the poll question you are asking?`
    );
    if (!question) return;

    const description = await getText(
      message,
      `What is the description of this poll?`
    );
    if (!description) return;

    const lastTime = await getText(
      message,
      `How long would you like this giveaway to last for? (ex. 2h, 3d, 1w)`
    );
    if (!lastTime) return;
    const endsAt = new Date(Date.now() + ms(lastTime));

    const optionAmount = await getNumber(message);
    if (!optionAmount) return;

    let options: string[] = [];
    for (let i = 0; i < optionAmount; i++) {
      const option = await getText(
        message,
        `What would you like **option ${i + 1}** to be?`
      );
      if (!option) break;

      options.push(option);
    }
    if (options.length !== optionAmount) return;

    const embed = embeds.normal(
      question,
      description +
        `\n\n${options.map((x, i) => `${emojis[i]} ${x}`).join("\n")}`
    );
    const testEmbed = await message.channel.send(embed);

    const confirm = await confirmation(
      `Poll Confirmation`,
      `Are you sure you would like to post this poll?`,
      message
    );

    if (confirm) {
      if (testEmbed.deletable) await testEmbed.delete();
      const pollMessage = await channel.send(`<@&${roles.polls}>`, embed);
      const optionEmojis = emojis.slice(0, options.length);

      await react(pollMessage, optionEmojis);
      await PollModel.create({
        starterId: message.author.id,
        channelId: channel.id,
        messageId: pollMessage.id,
        question,
        options,
        endsAt,
      });
    } else {
      if (testEmbed.deletable) await testEmbed.delete();
    }
  }
}

async function getChannel(message: Message) {
  const question = await message.channel.send(
    embeds.question(
      `Please tag the channel you would like to send the announcement in.`
    )
  );
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
    if (question.deletable) await question.delete();
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

async function getNumber(message: Message) {
  const question = await message.channel.send(
    embeds.question(`How many poll options would you like to have? (9 max)`)
  );
  const collector = await message.channel.awaitMessages(
    (x: Message) =>
      x.author.id === message.author.id &&
      !isNaN(parseInt(x.content)) &&
      parseInt(x.content) <= 9,
    {
      max: 1,
      time: 15 * 60 * 1000,
      errors: ["time"],
    }
  );
  if (collector.first()) {
    if (question.deletable) await question.delete();
    return parseInt(collector.first().content);
  } else {
    return null;
  }
}
