import { DocumentType } from "@typegoose/typegoose";
import { TextChannel, User } from "discord.js";
import Event, { EventNameType } from ".";
import { QOTD, QOTDModel } from "../models/QOTD";
import embeds from "../utils/embeds";
import { emojis, givePoints } from "../utils/storage";

export default class QOTDChecker extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      const qotdCursor = QOTDModel.find({
        endsAt: { $lte: new Date() },
      }).cursor();
      qotdCursor.on("data", async (qotd: DocumentType<QOTD>) => {
        const channel = guild.channels.resolve(qotd.channelId) as TextChannel;
        const message = await channel.messages.fetch(qotd.messageId);

        const optionEmojis = emojis.slice(0, qotd.options.length);
        const reactions = message.reactions.cache.filter((x) => x.count > 1);

        const correctReactionUsers = reactions.get(
          optionEmojis[qotd.correctAnswerIndex]
        ).users.cache;
        for (const user of correctReactionUsers) {
          if (!user[1].bot) {
            await givePoints(user[1], "qotd");
          } else continue;
        }

        if (message?.deletable) await message.delete();
        await channel.send(
          embeds.normal(
            `QOTD Ended`,
            `The qotd has ended.\nQuestion: **${
              qotd.question
            }**\nCorrect Answer: **${qotd.options[qotd.correctAnswerIndex]}**`
          )
        );
        await qotd.deleteOne();
      });
    }, 10 * 60 * 1000);
  }
}
