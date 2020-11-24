import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import ms from "ms";
import embeds from "../../utils/embeds";

export default class MuteCommand extends AutoModCommand {
  cmdName = "mute";
  description = "Configure what initiates a mute for a user.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const violationAmount = !isNaN(parseInt(args[0]))
      ? parseInt(args.shift())
      : null;
    if (!violationAmount)
      return message.channel.send(
        embeds.error(
          `Please provide the amount of violations needed to trigger a mute.`
        )
      );

    const time = args[0] ? ms(args.shift()) : null;
    if (!time)
      return message.channel.send(
        embeds.error(
          `Please provide the amount of time the **${violationAmount}** violations should be detected within.`
        )
      );

    guildData.moderation.muteViolationAmount = violationAmount;
    guildData.moderation.muteViolationInterval = time;
    await guildData.save();

    return await message.channel.send(
      embeds.normal(
        `Mute Configuration`,
        `Mute automod will trigger when a user receives **${violationAmount}** violations in under **${ms(
          time
        )}**.`
      )
    );
  }
}
