import { Message } from "discord.js";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";
import AdminCommand from ".";

export default class AnnounceCommand extends AdminCommand {
  cmdName = "announce";
  description = "Start the announcement wizard to post an announcement.";
  permissions = ["admin", "human", "mod"];

  async run(message: Message) {
    const channel = await getChannel(message);
    if (!channel) return;

    const title = await getText(
      message,
      `What would you like the title of the embed to be?`
    );
    if (!title) return;

    const description = await getText(
      message,
      `What would you like the description of the embed to be?`
    );
    if (!description) return;

    const roles = await getRoles(message);
    const embed = embeds.normal(title, description);
    const testEmbed = await message.channel.send(`${roles.join(", ")}`, embed);

    const confirm = await confirmation(
      `Announcement Confirmation`,
      `Are you sure you would like to post the embed above?`,
      message
    );

    if (confirm) {
      if (testEmbed.deletable) await testEmbed.delete();
      channel.send(`${roles.join(", ")}`, embed);
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

async function getRoles(message: Message) {
  const question = await message.channel.send(
    embeds.question(
      `Please tag all the roles you would like to mention.\nTo exclude role tags, say **none**.`
    )
  );
  const collector = await message.channel.awaitMessages(
    (x: Message) => x.author.id === message.author.id,
    {
      max: 1,
      time: 15 * 60 * 1000,
      errors: ["time"],
    }
  );
  if (collector.first()) {
    if (question.deletable) await question.delete();
    return collector.first().mentions.roles.array();
  } else return [];
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
