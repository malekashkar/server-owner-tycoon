import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import ms from "ms";
import embeds from "../../utils/embeds";

export default class SpamCommand extends AutoModCommand {
  cmdName = "spam";
  description = "Configure the spam detector settings.";
  usage = "<message amount> <time>";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const messageAmount = !isNaN(parseInt(args[0]))
      ? parseInt(args.shift())
      : null;
    if (!messageAmount)
      return message.channel.send(
        embeds.error(
          `Please provide the amount of messages needed to trigger spam.`
        )
      );

    const time = args[0] ? ms(args.shift()) : null;
    if (!time)
      return message.channel.send(
        embeds.error(
          `Please provide the amount of time the **${messageAmount}** should be detected within.`
        )
      );

    guildData.moderation.spamMessageAmount = messageAmount;
    guildData.moderation.spamTime = time;
    await guildData.save();

    return message.channel.send(
      embeds.normal(
        `Spam Configuration`,
        `Spam automod will trigger when a user sends **${messageAmount}** in under **${ms(
          time
        )}**.`
      )
    );
  }
}
