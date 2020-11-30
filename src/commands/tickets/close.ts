import { Message, TextChannel } from "discord.js";
import TicketCommand from ".";
import { TicketModel } from "../../models/ticket";
import confirmation from "../../utils/confirmation";
import { categories, channels } from "../../utils/storage";
import fs from "fs";
import path from "path";

export default class CloseCommand extends TicketCommand {
  cmdName = "close";
  description = "Close a ticket channel and save a transcript.";

  async run(message: Message) {
    if (
      (message.channel as TextChannel).parentID !== categories.tickets &&
      (message.channel as TextChannel).parentID !== categories.inProgressTickets
    )
      return;

    const confirm = await confirmation(
      `Close Confirmation`,
      `Are you sure you would like to close this ticket channel?`,
      message
    );

    if (confirm) {
      const channel = message.channel as TextChannel;
      const ticketData = await TicketModel.findOne({
        channelId: message.channel.id,
      });
      ticketData.closed = true;
      ticketData.closedById = message.author.id;
      await ticketData.save();

      const messages = ticketData.messages;
      const text = messages
        .map((x) => {
          const date = x.sentAt;
          const dateString = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          return `${x.userTag} ~ ${dateString}\n${x.content}`;
        })
        .join("\n");

      const transcriptDir = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "transcripts"
      );
      const transcriptFile = path.join(transcriptDir, `${channel.name}.txt`);

      if (!fs.existsSync(transcriptDir)) fs.mkdirSync(transcriptDir);
      fs.writeFileSync(transcriptFile, text);

      (message.guild.channels.resolve(
        channels.transcripts
      ) as TextChannel).send(
        `Here is the transcript for \`${channel.name}\`:`,
        {
          files: [transcriptFile],
        }
      );

      await channel.delete();
    }
  }
}
