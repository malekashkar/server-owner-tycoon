import Client from "../structures/client";
import { Message } from "discord.js";
import User from "../models/user";
import Guild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";
export default abstract class Command {
  isSubCommand = false;
  permission: string;
  disabled = false;
  module: string;

  abstract cmdName: string;
  abstract description: string;
  abstract async run(
    _client: Client,
    _message: Message,
    _args: string[],
    _userData?: DocumentType<User>,
    _guildData?: DocumentType<Guild>,
    _command?: string
  ): Promise<Message | void>;
}
