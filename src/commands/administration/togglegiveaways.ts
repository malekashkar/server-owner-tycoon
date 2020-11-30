import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class GiveawayCommand extends AdminCommand {
  cmdName = "togglegiveaways";
  description = "Toggle the giveaways from repeating every 24 hours.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const toggle = !guildData.giveawayPrize;
    const confirm = await confirmation(
      `${toggle ? `Enable` : `Disable`} Giveaways Confirmation`,
      `Are you sure you would like to ${
        toggle ? `enable` : `disable`
      } giveaways from running?`,
      message
    );

    if (confirm) {
      guildData.giveaways = toggle;
      await guildData.save();

      return await message.channel.send(
        embeds.normal(
          `Giveaways ${toggle ? `Enabled` : `Disabled`}`,
          `You have ${toggle ? `enable` : `disable`} giveaways.`
        )
      );
    }
  }
}
