import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class AutomodInvitesCommand extends AutoModCommand {
  cmdName = "no-invite";
  description = "Toggle the invite link auto moderation.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const confirm = await confirmation(
      `Invite Links Toggle`,
      `Toggle the auto moderation for posting invite links on and off.`,
      message
    );
    if (confirm) {
      guildData.moderation.invites = true;
      await message.channel.send(
        embeds.normal(
          `Invite Links Moderation Enabled`,
          `Auto moderation for invite links has been enabled.`
        )
      );
    } else {
      guildData.moderation.invites = false;
      await message.channel.send(
        embeds.normal(
          `Invite Links Moderation Disabled`,
          `Auto moderation for invite links has been disabled.`
        )
      );
    }
  }
}
