import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";

export default class GiveawayPrizeCommand extends AdminCommand {
  cmdName = "giveawayprize";
  description = "Change the increment of the giveaway prize.";
  usage = "<points amount>"
  permissions = ["admin"];

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const prize = !isNaN(parseInt(args[0])) ? parseInt(args.shift()) : null;
    if (!prize)
      return message.channel.send(
        embeds.error(
          `Please provide the new prize you would like to increment the giveaways by!`
        )
      );

    guildData.giveawayPrize = prize;
    await guildData.save();

    return message.channel.send(
      embeds.normal(
        `Giveaway Prize Updated`,
        `The giveaway prize increment has been updated to **${prize}** points.`
      )
    );
  }
}
