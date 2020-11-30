import { DocumentType } from "@typegoose/typegoose";
import { TextChannel, User } from "discord.js";
import Event, { EventNameType } from ".";
import { Poll, PollModel } from "../models/poll";
import { UserModel } from "../models/user";
import embeds from "../utils/embeds";
import { emojis, givePoints, roles } from "../utils/storage";

export default class PollChecker extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      const pollCursor = PollModel.find({
        endsAt: { $lte: new Date() },
      }).cursor();
      pollCursor.on("data", async (poll: DocumentType<Poll>) => {
        const channel = guild.channels.resolve(poll.channelId) as TextChannel;
        const message = await channel.messages.fetch(poll.messageId);

        const optionEmojis = emojis.slice(0, poll.options.length);
        const reactions = message.reactions.cache.filter((x) => x.count > 1);

        let users: User[];
        for (const reaction of reactions) {
          for (const user of reaction[1].users.cache) {
            if (!users.includes(user[1]) && !user[1].bot) {
              users.push(user[1]);
              await givePoints(user[1], "poll");
            } else continue;
          }
        }

        if (!reactions.size)
          return channel.send(
            `<@&${roles.polls}>`,
            embeds
              .normal(
                `Poll Ended`,
                `The poll has ended and none of the options were voted on!`
              )
              .setFooter(`Question: ${poll.question}`)
          );
        const arrangedReaction = reactions
          .sort((a, b) => b.count - a.count)
          .array();
        const topOption =
          poll.options[
            optionEmojis.indexOf(
              arrangedReaction[arrangedReaction.length - 1].emoji.name
            )
          ];

        if (message?.deletable) await message.delete();
        await channel.send(
          `<@&${roles.polls}>`,
          embeds
            .normal(
              `Poll Ended`,
              `The poll has ended and \`${topOption}\` was the most voted option!`
            )
            .setFooter(`Question: ${poll.question}`)
        );
        await poll.deleteOne();
      });
    }, 10 * 60 * 1000);
  }
}
