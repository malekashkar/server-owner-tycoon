import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from ".";
import Guild from "../models/guild";
import User from "../models/user";
import Client from "../structures/client";

export default class TestCommand extends Command {
  cmdName = "test";
  description = "Testing command.";

  async run(
    client: Client,
    message: Message,
    args: string[],
    userData: DocumentType<User>,
    guildData: DocumentType<Guild>
  ) {
    message.channel.send(`testing`);
  }
}
