import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class AutomodDisableCommand extends AutoModCommand {
  cmdName = "disable";
  description = "Disable automoderation.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    if (guildData.moderation.enabled) {
      const confirm = await confirmation(
        `Disable Automod`,
        `Are you sure you would like to disable automod?`,
        message
      );
      if (confirm) {
        guildData.moderation.enabled = false;
        await message.channel.send(
          embeds.normal(
            `Automoderation Disabled`,
            `Auto moderation has been disabled.`
          )
        );
      }
    } else {
      await message.channel.send(
        embeds.error(`Auto moderation is already disabled!`)
      );
    }
  }
}
