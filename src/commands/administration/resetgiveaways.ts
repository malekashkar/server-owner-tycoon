import { Message } from "discord.js";
import AdminCommand from ".";
import { GiveawayModel } from "../../models/giveaway";
import confirmation from "../../utils/confirmation";
import embeds from "../../utils/embeds";

export default class ResetGiveawaysCommand extends AdminCommand {
  cmdName = "resetgiveaways";
  description = "Reset the giveaways back to day 1.";
  permissions = ["admin"];

  async run(message: Message) {
    const confirm = await confirmation(
      `Reset Giveaways`,
      `Are you sure you would like to reset the giveaways counter?`,
      message
    );

    if (confirm) {
      await GiveawayModel.deleteMany({});
      return message.channel.send(
        embeds.normal(
          `The giveaway counter and prize has been reset to stage 1.`,
          `Giveaways Reset`
        )
      );
    }
  }
}
