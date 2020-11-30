import { Message } from "discord.js";
import AdminCommand from ".";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";
import ms from "ms";
import { emojis } from "../../utils/storage";
import react from "../../utils/react";
import { QOTDModel } from "../../models/QOTD";

export default class QOTDCommand extends AdminCommand {
  cmdName = "qotd";
  description = "Create a qotd for users to vote on.";

  async run(message: Message) {
    const channel = await getChannel(message);
    if (!channel) return;

    const question = await getText(
      message,
      `What is the qotd question you are asking?`
    );
    if (!question) return;

    const description = await getText(
      message,
      `What is the description of this qotd?`
    );
    if (!description) return;

    const lastTime = await getText(
      message,
      `How long would you like this qotd to last for? (ex. 2h, 3d, 1w)`
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

    const optionEmojis = emojis.slice(0, options.length);
    const correctAnswerQuestion = await message.channel.send(
      embeds.question(
        `Please select the correct answer.\n\n${options
          .map((x, i) => `${optionEmojis[i]} ${x}`)
          .join("/n")}`
      )
    );
    await react(correctAnswerQuestion, optionEmojis);
    
    const correctAnswerCollector = await correctAnswerQuestion.awaitReactions(
      (r, u) =>
        u.id === message.author.id && optionEmojis.includes(r.emoji.name),
      { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
    );
    if (correctAnswerCollector?.first()) {
      if (correctAnswerQuestion.deletable) await correctAnswerQuestion.delete();

      const correctAnswer =
        options[
          optionEmojis.indexOf(correctAnswerCollector.first().emoji.name)
        ];

      const embed = embeds.normal(
        question,
        description +
          `\n\n${options.map((x, i) => `${emojis[i]} ${x}`).join("\n")}`
      );
      const testEmbed = await message.channel.send(embed);

      const confirm = await confirmation(
        `Qotd Confirmation`,
        `Are you sure you would like to post this qotd?`,
        message
      );

      if (confirm) {
        if (testEmbed.deletable) await testEmbed.delete();
        const qotdMessage = await channel.send(embed);
        const optionEmojis = emojis.slice(0, options.length);

        await react(qotdMessage, optionEmojis);
        await QOTDModel.create({
          starterId: message.author.id,
          channelId: channel.id,
          messageId: qotdMessage.id,
          correctAnswer,
          question,
          options,
          endsAt,
        });
      } else {
        if (testEmbed.deletable) await testEmbed.delete();
      }
    } else {
      if (correctAnswerQuestion.deletable) await correctAnswerQuestion.delete();
    }
  }
}

async function getChannel(message: Message) {
  const question = await message.channel.send(
    embeds.question(
      `Please tag the channel you would like to send the qotd in.`
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
    embeds.question(`How many qotd options would you like to have? (9 max)`)
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
