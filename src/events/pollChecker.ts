import { DocumentType } from "@typegoose/typegoose";
import { TextChannel, User } from "discord.js";
import Event, { EventNameType } from ".";
import { Poll, PollModel } from "../models/poll";
import embeds from "../utils/embeds";
import { emojis, formatTime, roles } from "../utils/storage";
import givePoints from "../utils/points"

export default class PollChecker extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      // Ongoing polls
      const ongoingPollCursor = PollModel.find({
        endsAt: { $gt: new Date() },
      }).cursor();
      ongoingPollCursor.on("data", async (poll: DocumentType<Poll>) => {
        const channel = guild.channels.resolve(poll.channelId) as TextChannel;
        const message = await channel.messages.fetch(poll.messageId);
        const timeLeft = poll.endsAt.getTime() - Date.now();
        const embed = message.embeds[0];

        embed.fields[0] = {
          name: `⏱️ Time Left`,
          value: `${formatTime(timeLeft)}`,
          inline: false,
        };

        await message.edit(embed);
      });

      // Ended polls
      const endedPollCursor = PollModel.find({
        endsAt: { $lte: new Date() },
      }).cursor();
      endedPollCursor.on("data", async (poll: DocumentType<Poll>) => {
        const channel = guild.channels.resolve(poll.channelId) as TextChannel;
        const message = await channel.messages.fetch(poll.messageId);

        const optionEmojis = emojis.slice(0, poll.options.length);
        const reactions = message.reactions.cache.filter((x) => x.count > 1);

        let users: User[] = [];
        for (const reaction of reactions) {
          for (const user of reaction[1].users.cache) {
            if (!users.includes(user[1]) && !user[1].bot) {
              users.push(user[1]);
              await givePoints(user[1], "poll");
            } else continue;
          }
        }

        if (!reactions.size) {
          channel.send(
            `<@&${roles.polls}>`,
            embeds
              .normal(
                `Poll Ended`,
                `The poll has ended and none of the options were voted on!`
              )
              .setFooter(`Question: ${poll.question}`)
          );
        } else {
          const topEmojis = reactions.sort((a, b) => b.count - a.count);
          if (topEmojis.size > 1 && topEmojis.size < 3) {
            if (topEmojis.array()[0].count !== topEmojis.array()[1].count) {
              const topOption =
                poll.options[
                  optionEmojis.indexOf(topEmojis.first().emoji.name)
                ];
              channel.send(
                `<@&${roles.polls}>`,
                embeds
                  .normal(
                    `Poll Ended`,
                    `The poll has ended and **${topOption}** was the most voted option!`
                  )
                  .setFooter(`Question: ${poll.question}`)
              );
            } else if (
              topEmojis.array()[0].count === topEmojis.array()[1].count
            ) {
              const firstOption =
                poll.options[
                  optionEmojis.indexOf(topEmojis.array()[0].emoji.name)
                ];
              const secondOption =
                poll.options[
                  optionEmojis.indexOf(topEmojis.array()[1].emoji.name)
                ];
              channel.send(
                `<@&${roles.polls}>`,
                embeds
                  .normal(
                    `Poll Ended`,
                    `The poll has ended in a tie.\n- **${firstOption}**\n- **${secondOption}**`
                  )
                  .setFooter(`Question: ${poll.question}`)
              );
            }
          } else if (topEmojis.size >= 3) {
            if (topEmojis.array()[0].count !== topEmojis.array()[1].count) {
              const topOption =
                poll.options[
                  optionEmojis.indexOf(topEmojis.first().emoji.name)
                ];
              channel.send(
                `<@&${roles.polls}>`,
                embeds
                  .normal(
                    `Poll Ended`,
                    `The poll has ended and **${topOption}** was the most voted option!`
                  )
                  .setFooter(`Question: ${poll.question}`)
              );
            } else if (
              topEmojis.array()[0].count === topEmojis.array()[1].count &&
              topEmojis.array()[1].count !== topEmojis.array()[2].count
            ) {
              const firstOption =
                poll.options[
                  optionEmojis.indexOf(topEmojis.array()[0].emoji.name)
                ];
              const secondOption =
                poll.options[
                  optionEmojis.indexOf(topEmojis.array()[1].emoji.name)
                ];
              channel.send(
                `<@&${roles.polls}>`,
                embeds
                  .normal(
                    `Poll Ended`,
                    `The poll has ended in a tie.\n- **${firstOption}**\n- **${secondOption}**`
                  )
                  .setFooter(`Question: ${poll.question}`)
              );
            } else if (
              topEmojis.array()[0].count === topEmojis.array()[1].count &&
              topEmojis.array()[1].count === topEmojis.array()[2].count
            ) {
              channel.send(
                `<@&${roles.polls}>`,
                embeds
                  .normal(
                    `Poll Ended`,
                    `The poll has ended in a three or more way tie!`
                  )
                  .setFooter(`Question: ${poll.question}`)
              );
            }
          }
        }

        if (message?.deletable) await message.delete();
        await poll.deleteOne();
      });
    }, 10 * 1000);
  }
}
