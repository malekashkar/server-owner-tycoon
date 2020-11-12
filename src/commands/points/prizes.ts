import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import PointsCommand from ".";
import embeds from "../../utils/embeds";

export default class PrizesCommand extends PointsCommand {
  cmdName = "prizes";
  description = "Check what prizes you can get for your points.";

  async run(message: Message) {
    message.channel.send(
      embeds.normal(
        `Prizes List`,
        stripIndents`**PayPal**
      $10 PayPal - 10k points
      $25 PayPal - 25k points
      $50 PayPal - 50k points
      $100 PayPal - 100k points
      
      **Discord Server**
      Mention in Announcement - 1k points
      Add Server Emoji - 2k points
      Color Discord Role - 2.5k points
      Top of List 24 Hours - 3k points
      VIP Rank - 5k points
      
      **Gift cards**
      Visa ($25, $50) - 30k points, 60k points
      Microsoft ($25, $50) - 25k points, 50k points
      Apple ($25, $50) - 25k points, 50k points
      Steam ($25, $50) - 25k points, 50k points
      Amazon ($25, $50) - 25k points, 50k points
      
      **Discord Nitro**
      Nitro Classic 1 month - 5k points
      Discord Nitro 1 month - 10k points`
      )
    );
  }
}
