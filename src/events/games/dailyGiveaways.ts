import Event, { EventNameType } from "..";
import {
  channels,
  formatTime,
  getRandomIntBetween,
  roles,
} from "../../utils/storage";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { GuildModel } from "../../models/guild";
import { Giveaway, GiveawayModel } from "../../models/giveaway";
import embeds from "../../utils/embeds";
import Logger from "../../utils/logger";
import { UserModel } from "../../models/user";
import { DocumentType } from "@typegoose/typegoose";

export default class Giveaways extends Event {
  name: EventNameType = "ready";

  async handle() {
    const guild = this.client.guilds.cache.first();

    setInterval(async () => {
      try {
        const giveawayAmount = await GiveawayModel.countDocuments();
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
        if (!giveawayAmount && guildData.giveaways) {
          const randomNumber = getRandomIntBetween(1, 100);
          const newGiveawayMessage = await this.sendEmbed(
            guildData.giveawayPrize
          );
          await GiveawayModel.create({
            giveawayMessageId: newGiveawayMessage.id,
            prize: guildData.giveawayPrize,
            randomNumber,
            endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
        }
        // Ongoing Giveaways
        else if (ongoingGiveaway) {
          const message = await channel.messages.fetch(
            ongoingGiveaway.giveawayMessageId
          );
          this.updateEmbed(message, ongoingGiveaway);
        }
        // Ended Giveaways
        else if (endedGiveaway) {
          const message = channel.messages.resolve(
            endedGiveaway.giveawayMessageId
          );
          if (message) {
            if (message.deletable) await message.delete();
            const prizePool =
              (await GiveawayModel.countDocuments({
                continueCount: true,
              })) * guildData.giveawayPrize;

            const winners = endedGiveaway.winners?.map((x) => `<@${x}>`);
            if (!winners.length) {
              const endMessage = await channel.send(
                embeds.normal(
                  `Giveaway Ended`,
                  `All **${
                    endedGiveaway.participants.length
                  } participants** failed to guess the number **${
                    endedGiveaway.randomNumber
                  }**!\nThe giveaway prize pool has **increased by ${
                    guildData.giveawayPrize
                  } points** to **${
                    prizePool + guildData.giveawayPrize
                  } points**.`
                )
              );
              endMessage.delete({ timeout: 10 * 60 * 1000 });
            } else {
              const eachPrize = Number(
                (prizePool / winners.length).toString(2)
              );

              await GiveawayModel.updateMany(
                {},
                { $set: { continueCount: false } }
              );

              for (let i = 0; i < endedGiveaway.winners.length; i++) {
                await UserModel.updateOne(
                  {
                    userId: endedGiveaway.winners[i],
                  },
                  {
                    $inc: { points: eachPrize },
                  }
                );
              }

              const endMessage = await channel.send(
                embeds.normal(
                  `Ended Giveaway`,
                  `${winners} won the giveaway for **${prizePool} points** out of the **${endedGiveaway.participants.length} participants**.`
                )
              );
              endMessage.delete({ timeout: 10 * 60 * 1000 });
            }
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
              endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
          }
        }
      } catch (err) {
        Logger.error("GIVEAWAYS", err);
      }
    }, 10 * 1000);
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
        `To join, please private message me (the bot) with a number between 1-100. You may only enter one response per day and may not edit your message. All other entries and edited messages will be ignored.\n\nIf any people guessed the correct number, it will be announced here in this channel. Multiple winners = prize pool split. Otherwise, if no one guesses the correct number, the prize pool will increase by $1 each day.`
      )
      .addField(`⏱️ Time Left`, `**${formatTime(24 * 60 * 60 * 1000)}**`, true)
      .addField(`💵 Current Prize Pool`, `**${prize} points**`, true)
      .addField(`👥 Participants`, `**0 participants**`, true);
    return await channel.send(`<@&${roles.giveaways}>`, embed);
  }

  async updateEmbed(message: Message, giveaway: DocumentType<Giveaway>) {
    if (message.author === this.client.user) {
      const timeLeft = giveaway.endsAt.getTime() - Date.now();
      const embed = message.embeds[0];
      if (!embed) return;

      embed.fields[1] = {
        name: "⏱️ Time Left",
        value: `**${formatTime(timeLeft)}**`,
        inline: true,
      };
      embed.fields[3] = {
        name: `👥 Participants`,
        value: `**${giveaway.participants.length} participants**`,
        inline: true,
      };
      return message.edit(embed);
    }
  }
}
