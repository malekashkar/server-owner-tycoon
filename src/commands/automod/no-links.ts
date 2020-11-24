import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class AutomodLinksCommand extends AutoModCommand {
  cmdName = "no-links";
  description = "Toggle the links auto moderation.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    if (guildData.moderation.whitelistedChannelIds.includes(message.channel.id))
      return;

    const confirm = await confirmation(
      `Links Toggle`,
      `Toggle the auto moderation for posting links on and off.`,
      message
    );
    if (confirm) {
      guildData.moderation.links = true;
      await message.channel.send(
        embeds.normal(
          `Links Moderation Enabled`,
          `Auto moderation for links has been enabled.`
        )
      );
    } else {
      guildData.moderation.links = false;
      await message.channel.send(
        embeds.normal(
          `Links Moderation Disabled`,
          `Auto moderation for links has been disabled.`
        )
      );
    }
  }
}
