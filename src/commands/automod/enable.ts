import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class AutomodToggleCommand extends AutoModCommand {
  cmdName = "toggle";
  description = "Toggle automod on and off.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    if (!guildData.moderation.enabled) {
      const confirm = await confirmation(
        `Enable Automod`,
        `Are you sure you would like to enable automod?`,
        message
      );
      if (confirm) {
        guildData.moderation.enabled = true;
        await message.channel.send(
          embeds.normal(
            `Automoderation Enabled`,
            `Auto moderation has been enabled.`
          )
        );
      }
    } else {
      await message.channel.send(
        embeds.error(`Auto moderation is already enabled!`)
      );
    }
  }
}
