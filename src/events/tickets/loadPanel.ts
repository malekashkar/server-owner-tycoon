import { TextChannel } from "discord.js";
import Event, { EventNameType } from "..";
import { GuildModel } from "../../models/guild";

export default class LoadPanel extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = await this.client.guilds.fetch("565005586060804136");
    if (guild) {
      const guildData = await GuildModel.findOne({
        guildId: "565005586060804136",
      });
      if (
        guildData?.channels?.ticketPanel &&
        guildData?.messages?.ticketPanel
      ) {
        (guild.channels.resolve(
          guildData.channels.ticketPanel
        ) as TextChannel).messages.fetch(guildData.messages.ticketPanel);
      }
    }
  }
}
