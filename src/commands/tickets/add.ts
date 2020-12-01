import { Message, TextChannel } from "discord.js";
import TicketCommand from ".";
import embeds from "../../utils/embeds";

export default class TicketAddCommand extends TicketCommand {
  cmdName = "add";
  description = "Add users or roles to your ticket.";
  permissions = ["administrator", "human", "mod", "support"];

  async run(message: Message) {
    const users = message.mentions.users;
    const roles = message.mentions.roles;

    if (!users.size && !roles.size)
      return message.channel.send(
        embeds.error(`Please tag roles and/or users to add to the ticket.`)
      );

    if (users.size) {
      for (const user of users) {
        (message.channel as TextChannel).updateOverwrite(user[1], {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
          READ_MESSAGE_HISTORY: true,
        });
      }
    }
    if (roles.size) {
      for (const role of roles) {
        (message.channel as TextChannel).updateOverwrite(role[1], {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
          READ_MESSAGE_HISTORY: true,
        });
      }
    }

    return message.channel.send(
      embeds.normal(
        `Roles/Users Added`,
        `I have added ${roles.size ? roles.array().join(" ") + " " : ``}${
          users.size ? users.array().join(" ") + " " : ``
        } to the ticket.`
      )
    );
  }
}
