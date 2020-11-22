import Event, { EventNameType } from "..";
import {
  channels,
  getRandomIntBetween,
  msToFormattedTime,
  roles,
} from "../../utils/storage";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { GuildModel } from "../../models/guild";
import { GiveawayModel } from "../../models/giveaway";
import embeds from "../../utils/embeds";
import Logger from "../../utils/logger";

const hourInMilliseconds = 24 * 60 * 60 * 1000;

export default class Giveaways extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      try {
        const guildData =
          (await GuildModel.findOne({
            guildId: guild.id,
          })) ||
          (await GuildModel.create({
            guildId: guild.id,
          }));
        const channel = guild.channels.resolve(
          channels.giveaways
        ) as TextChannel;
        const ongoingGiveaway = await GiveawayModel.findOne({
          endsAt: { $gte: new Date() },
          ended: false,
        });
        const endedGiveaway = await GiveawayModel.findOne({
          endsAt: { $lte: new Date() },
          ended: false,
        });

        // First Giveaway
        if (!(await GiveawayModel.countDocuments()) && guildData.giveaways) {
          const randomNumber = getRandomIntBetween(1, 100);
          const prizePool = await GiveawayModel.countDocuments({
            continueCount: true,
          });

          const newGiveawayMessage = await this.sendEmbed(
            prizePool + guildData.giveawayPrize
          );
          await GiveawayModel.create({
            giveawayMessageId: newGiveawayMessage.id,
            prize: prizePool + guildData.giveawayPrize,
            randomNumber,
            endsAt: new Date(Date.now() + hourInMilliseconds),
          });
        }
        // Ongoing Giveaways
        else if (ongoingGiveaway) {
          const message = await channel.messages.fetch(
            ongoingGiveaway.giveawayMessageId
          );
          if (message && ongoingGiveaway.endsAt)
            this.updateEmbed(message, ongoingGiveaway.endsAt);
        }
        // Ended Giveaways
        else if (endedGiveaway) {
          const message = await channel.messages.fetch(
            endedGiveaway.giveawayMessageId
          );
          if (message?.deletable) await message.delete();
          const prizePool =
            (await GiveawayModel.countDocuments({
              continueCount: true,
            })) * guildData.giveawayPrize;

          const winners = endedGiveaway.winners?.map((x) => `<@${x}>`);
          if (!winners.length)
            channel.send(
              embeds.normal(
                `Ended Giveaway`,
                `No one guessed the number **${
                  endedGiveaway.randomNumber
                }**!\nThe giveaway prize pool has **increased by $${
                  guildData.giveawayPrize
                }** to **$${prizePool + guildData.giveawayPrize}**.`
              )
            );
          else {
            await GiveawayModel.updateMany(
              {},
              { $set: { continueCount: false } }
            );
            channel.send(
              embeds.normal(
                `Ended Giveaway`,
                `${winners} won the giveaway and are splitting **$${prizePool}** equally. (${(
                  prizePool / winners.length
                ).toString(2)} each)`
              )
            );
          }

          endedGiveaway.ended = true;
          await endedGiveaway.save();

          if (guildData.giveaways) {
            const randomNumber = getRandomIntBetween(1, 100);
            const currentPrizePool =
              (await GiveawayModel.countDocuments({
                continueCount: true,
              })) * guildData.giveawayPrize;

            const newGiveawayMessage = await this.sendEmbed(
              currentPrizePool + guildData.giveawayPrize
            );
            await GiveawayModel.create({
              giveawayMessageId: newGiveawayMessage.id,
              prize: currentPrizePool + guildData.giveawayPrize,
              randomNumber,
              endsAt: new Date(Date.now() + hourInMilliseconds),
            });
          }
        }
      } catch (err) {
        Logger.error("GIVEAWAYS", err);
      }
    }, 5 * 60 * 1000);
  }

  async sendEmbed(prize: number) {
    const guild = this.client.guilds.cache.first();
    const channel = guild.channels.resolve(channels.giveaways) as TextChannel;
    const days = await GiveawayModel.countDocuments();
    const embed = new MessageEmbed()
      .setTitle(`The Dollar Lottery - Day ${days}`)
      .setDescription(`Welcome to the giveaway channel!`)
      .addField(
        `📖 How to play`,
        `To join, please private message me (the bot) with a number between 1-100. You may only enter one response per day and may not edit your message. All other entries and edited messages will be ignored.\n\nIf any people guessed the correct number, it will be announced here in this channel. Multiple winners = prize pool split. Otherwise, if no one guesses the correct number, the prize pool will increase by $1 each day. This giveaway process will be from no until December 25, 2020.`
      )
      .addField(`⏱️ Time Left`, `**${msToFormattedTime(hourInMilliseconds)}**`)
      .addField(`💵 Current Prize Pool`, `**$${prize}**`);
    return await channel.send(`<@&${roles.giveaways}>`, embed);
  }

  async updateEmbed(message: Message, endsAt: Date) {
    if (message.author === this.client.user) {
      const timeLeft = Date.now() - endsAt.getTime();
      const embed = message.embeds[0];
      if (!embed) return;

      embed.fields[1] = {
        name: "⏱️ Time Left",
        value: `**${msToFormattedTime(timeLeft)}**`,
        inline: true,
      };
      return await message.edit(embed);
    }
  }
}
