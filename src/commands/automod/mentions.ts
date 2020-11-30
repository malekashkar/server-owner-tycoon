import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";

export default class AutomodMentionsCommand extends AutoModCommand {
  cmdName = "mentions";
  description = "Set the amount of mentions detected by auto moderation.";
  usage = "<mention amount>";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const mentionAmount = !isNaN(parseInt(args[0]))
      ? parseInt(args.shift())
      : null;
    if (mentionAmount === null)
      return message.channel.send(
        embeds.error(`Please provide the number of mentions.`)
      );

    guildData.moderation.mentions = mentionAmount;
    await guildData.save();

    await message.channel.send(
      embeds.normal(
        `Mentions Auto Moderation`,
        `The mentions auto moderation has been set to detect at ${mentionAmount} mentions.`
      )
    );
  }
}
