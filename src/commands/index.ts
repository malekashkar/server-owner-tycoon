import Client from "../..";
import { Message } from "discord.js";
import DbUser from "../models/user";
import DbGuild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";

export default abstract class Command {
  isSubCommand = false;
  permissions: string[] = [];
  disabled = false;
  usage = "";
  
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  abstract group: string;
  abstract cmdName: string;
  abstract description: string;
  abstract run(
    _message: Message,
    _args: string[],
    _userData?: DocumentType<DbUser>,
    _guildData?: DocumentType<DbGuild>
  ): Promise<Message | void>;
}
