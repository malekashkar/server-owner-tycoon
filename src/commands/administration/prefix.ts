import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";

export default class PrefixCommand extends AdminCommand {
  cmdName = "prefix";
  description = "Change the prefix of the discord bot.";
  usage = "<prefix>";
  permissions = ["admin"];

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const oldPrefix = guildData.prefix;
    const newPrefix = args[0];
    if (!newPrefix)
      return message.channel.send(
        embeds.error(`Please provide the new prefix you would like to use.`)
      );

    guildData.prefix = newPrefix;
    await guildData.save();

    message.channel.send(
      embeds.normal(
        `Prefix Changed`,
        `The prefix has been changed from **${oldPrefix}** to **${newPrefix}**.`
      )
    );
  }
}
