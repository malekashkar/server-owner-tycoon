import { DocumentType } from "@typegoose/typegoose";
import Event from "..";
import Country, { CountryModel } from "../../models/country";

export default class CountrySelectorLeave extends Event {
  name = "ready";

  async handle() {
    setInterval(async () => {
      const dataCursor = CountryModel.find({
        startedAt: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      }).cursor();

      dataCursor.on("data", async (selector: DocumentType<Country>) => {
        const channel = this.client.guilds
          .resolve(this.client.mainGuild)
          .channels.resolve(selector.channelId);
        const member = this.client.guilds
          .resolve(this.client.mainGuild)
          .members.resolve(selector.userId);

        await channel.delete();
        await member.kick();
        await CountryModel.deleteOne(selector);
      });
    }, 3 * 60 * 60 * 1000);
  }
}
