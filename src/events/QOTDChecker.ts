import { DocumentType } from "@typegoose/typegoose";
import { TextChannel } from "discord.js";
import Event, { EventNameType } from ".";
import { QOTD, QOTDModel } from "../models/QOTD";
import embeds from "../utils/embeds";
import { emojis, formatTime, givePoints } from "../utils/storage";

export default class QOTDChecker extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      // Ongoing qotd
      const ongoingQotdCursor = QOTDModel.find({
        endsAt: { $gt: new Date() },
      }).cursor();
      ongoingQotdCursor.on("data", async (qotd: DocumentType<QOTD>) => {
        const channel = guild.channels.resolve(qotd.channelId) as TextChannel;
        const message = await channel.messages.fetch(qotd.messageId);
        const timeLeft = qotd.endsAt.getTime() - Date.now();
        const embed = message.embeds[0];

        embed.fields[0] = {
          name: `⏱️ Time Left`,
          value: `${formatTime(timeLeft)}`,
          inline: false,
        };

        await message.edit(embed);
      });

      // Ended qotd
      const endedQotdCursor = QOTDModel.find({
        endsAt: { $lte: new Date() },
      }).cursor();
      endedQotdCursor.on("data", async (qotd: DocumentType<QOTD>) => {
        const channel = guild.channels.resolve(qotd.channelId) as TextChannel;
        const message = await channel.messages.fetch(qotd.messageId);

        const optionEmojis = emojis.slice(0, qotd.options.length);
        const reactions = message.reactions.cache.filter((x) => x.count > 1);

        if (reactions) {
          const correctReactionUsers = reactions.get(
            optionEmojis[qotd.correctAnswerIndex]
          );
          if (correctReactionUsers) {
            for (const user of correctReactionUsers.users.cache) {
              if (!user[1].bot) {
                await givePoints(user[1], "qotd");
              } else continue;
            }
          }
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
    }, 10 * 1000);
  }
}
