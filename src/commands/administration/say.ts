import { Message } from "discord.js";
import embeds from "../../utils/embeds";
import AdminCommand from ".";

export default class SayCommand extends AdminCommand {
  cmdName = "say";
  description = "Send a simple message in a specific channel.";
  permissions = ["admin", "human"];

  async run(message: Message) {
    const channel = await getChannel(message);
    if (!channel) return;

    const text = await getText(message, `What would you like the text to be?`);
    if (!text) return;

    channel.send(text);
  }
}

async function getChannel(message: Message) {
  const question = await message.channel.send(
    embeds.question(
      `Please tag the channel you would like to post the message in.`
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
