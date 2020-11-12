import Client from "../..";
import { Message } from "discord.js";
import DbUser from "../models/user";
import DbGuild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";
export default abstract class Command {
  isSubCommand = false;
  permission: string;
  disabled = false;
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  abstract group: string;
  abstract cmdName: string;
  abstract description: string;
  abstract async run(
    _message: Message,
    _args: string[],
    _userData?: DocumentType<DbUser>,
    _guildData?: DocumentType<DbGuild>
  ): Promise<Message | void>;
}
