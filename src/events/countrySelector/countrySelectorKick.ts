import { DocumentType } from "@typegoose/typegoose";
import Event from "..";
import Country, { CountryModel } from "../../models/country";

export default class CountrySelectorLeave extends Event {
  name = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      const dataCursor = CountryModel.find({
        startedAt: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      }).cursor();

      dataCursor.on("data", async (selector: DocumentType<Country>) => {
        const channel = guild.channels.resolve(selector.channelId);
        const member = guild.members.resolve(selector.userId);

        await channel.delete();
        await member.kick();
        await CountryModel.deleteOne(selector);
      });
    }, 3 * 60 * 60 * 1000);
  }
}
