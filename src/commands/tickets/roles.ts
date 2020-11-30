import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import TicketCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";

export default class TicketRolesCommand extends TicketCommand {
  cmdName = "roles";
  description = "Set which roles are included in ticket channels.";
  isSubCommand = true;
  usage = "<@roles>...";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const roles = message.mentions.roles;
    if (!roles.size)
      return message.channel.send(
        embeds.error(`Please tag the roles you would like tickets to allow.`)
      );

    guildData.ticketRoles = roles.map((x) => x.id);
    await guildData.save();

    return message.channel.send(
      embeds.normal(
        `Ticket Roles`,
        `The ticket roles has been set to ${roles.array().join(", ")}.`
      )
    );
  }
}
