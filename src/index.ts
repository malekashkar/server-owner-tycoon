import fs from "fs";
import ms from "ms";
import _ from "lodash";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Event from "./events";
import Command from "./commands";
import logger from "./utils/logger";
import Client from "./structures/client";

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import embeds from "./utils/embeds";
import { BanModel } from "./models/ban";
import { MuteModel } from "./models/mute";
import { GuildModel } from "./models/guild";
import { TextChannel, User } from "discord.js";
import { GiveawayModel } from "./models/giveaway";

export default class Modules {
  constructor(client: Client, settings: ISettings) {
    console.log(path.join(__dirname, "..", "..", ".env"));

    client.login(settings.token);
    logger.info("BOT", `Logging into bot with ID "${settings.clientId}".`);

    this.loadDatabase(settings.clientId);
    logger.info("DATABASE", `The database is connecting.`);

    this.loadCommands(client, settings.modules);
    this.loadEvents(client, settings.modules);
    this.initGarbageCollectors(client);
  }

  loadDatabase(dbName: string) {
    if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
      mongoose.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`,
        {
          dbName,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          connectTimeoutMS: 60000,
          socketTimeoutMS: 60000,
          serverSelectionTimeoutMS: 60000,
        },
        (err) => {
          if (err) logger.error("DATABASE", err);
          else
            logger.info(
              "DATABASE",
              `The database has been connected successfully.`
            );
        }
      );
    } else {
      mongoose.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`,
        {
          dbName,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          connectTimeoutMS: 60000,
          socketTimeoutMS: 60000,
          serverSelectionTimeoutMS: 60000,
          auth: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
          },
        },
        (err) => {
          if (err) logger.error("DATABASE", err);
          else
            logger.info(
              "DATABASE",
              `The database has been connected successfully.`
            );
        }
      );
    }
  }

  loadCommands(
    client: Client,
    modules: string[],
    directory: string = path.join(__dirname, "commands")
  ) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return;

    const commandFiles = fs.readdirSync(directory);
    for (const commandFile of commandFiles) {
      const commandPath = path.join(directory, commandFile);
      const commandFileStats = fs.statSync(commandPath);
      if (!commandFileStats.isFile()) {
        this.loadCommands(client, modules, commandPath);
        continue;
      }
      if (
        !commandFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(commandFile) ||
        path.parse(commandPath).name === "index"
      )
        continue;

      const tmpCommand = require(commandPath);
      const command =
        typeof tmpCommand !== "function" &&
        typeof tmpCommand.default === "function"
          ? tmpCommand.default
          : typeof tmpCommand === "function"
          ? tmpCommand
          : null;

      try {
        const commandObj: Command = new command(this);
        if (
          commandObj.module &&
          !modules.includes(commandObj.module.toLowerCase())
        )
          continue;
        if (commandObj && commandObj.cmdName) {
          if (client.commands.has(commandObj.cmdName)) {
            logger.error(
              `DUPLICATE_COMMAND`,
              `Duplicate command ${commandObj.cmdName}.`
            );
          } else
            client.commands.set(
              commandObj.isSubCommand
                ? commandObj.module + `_${commandObj.cmdName}`
                : commandObj.cmdName,
              commandObj
            );
        }
      } catch (e) {}
    }
  }

  loadEvents(
    client: Client,
    modules: string[],
    directory = path.join(__dirname, "events")
  ) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return;

    const eventFiles = fs.readdirSync(directory);
    for (const eventFile of eventFiles) {
      const eventPath = path.join(directory, eventFile);
      const eventFileStats = fs.statSync(eventPath);
      if (!eventFileStats.isFile()) {
        this.loadEvents(client, modules, eventPath);
        continue;
      }
      if (
        !eventFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(eventFile) ||
        path.parse(eventPath).name === "index"
      )
        continue;

      const tmpEvent = require(eventPath);
      const event =
        typeof tmpEvent.default === "function" ? tmpEvent.default : null;
      if (!event) return;

      try {
        const eventObj: Event = new event(this);
        if (
          eventObj.module &&
          eventObj.module !== "" &&
          !modules.includes(eventObj.module.toLowerCase())
        )
          continue;
        if (eventObj && eventObj.name) {
          client.addListener(eventObj.name, (...args) =>
            eventObj.handle.bind(eventObj)(client, ...args)
          );
        }
      } catch (ignored) {}
    }
  }

  initGarbageCollectors(client: Client) {
    setInterval(async () => {
      // Giveaways
      const endedGiveawayCursor = GiveawayModel.find({
        ended: false,
        endsAt: { $lte: new Date() },
      }).cursor();

      const runningGiveawayCursor = GiveawayModel.find({
        ended: false,
        endsAt: { $gt: new Date() },
      }).cursor();

      runningGiveawayCursor.on("data", async (giveaway) => {
        const guildData = await GuildModel.findOne({
          guildId: giveaway.guildId,
        });
        if (!guildData) return await GiveawayModel.deleteOne(giveaway);

        const giveawayGuild = client.guilds.resolve(giveaway.guildId);
        if (!giveawayGuild) return await GiveawayModel.deleteOne(giveaway);

        const giveawayChannel = giveawayGuild.channels.resolve(
          giveaway.channelId
        ) as TextChannel;
        if (!giveawayChannel) return await GiveawayModel.deleteOne(giveaway);

        const giveawayMessage = giveawayChannel.messages.resolve(
          giveaway.messageId
        );
        if (!giveawayMessage || giveawayMessage.deleted)
          return await GiveawayModel.deleteOne(giveaway);

        giveawayMessage.embeds[0].fields[0] = {
          name: "Time Left",
          value: `<:timer:765595933027074070> **${ms(
            giveaway.endsAt.getTime() - Date.now()
          )}**`,
          inline: true,
        };

        giveawayMessage.edit(giveawayMessage.embeds[0]);
      });

      endedGiveawayCursor.on("data", async (giveaway) => {
        const guildData = await GuildModel.findOne({
          guildId: giveaway.guildId,
        });
        if (!guildData) return await GiveawayModel.deleteOne(giveaway);

        const giveawayGuild = client.guilds.resolve(giveaway.guildId);
        if (!giveawayGuild) return await GiveawayModel.deleteOne(giveaway);

        const giveawayChannel = giveawayGuild.channels.resolve(
          giveaway.channelId
        ) as TextChannel;
        if (!giveawayChannel)
          return await GiveawayModel.deleteOne({
            messageId: giveaway.messageId,
          });

        const giveawayMessage = giveawayChannel.messages.resolve(
          giveaway.messageId
        );
        if (!giveawayMessage || giveawayMessage.deleted)
          return await GiveawayModel.deleteOne(giveaway);

        const reactedUsers = giveawayMessage.reactions
          .resolve("🎉")
          .users.cache.array()
          .filter((x: User) => !x.bot);

        if (reactedUsers.length < giveaway.winners) {
          giveawayMessage.edit(
            `:tada: **GIVEAWAY ENDED** :tada:`,
            embeds
              .normal(
                guildData,
                giveaway.prize,
                `Not enough members entered the giveaway for me to draw a winner...`
              )
              .setFooter(`0 Winners | Ended at`)
              .setTimestamp(Date.now())
          );
        } else {
          const winners = _.sampleSize(reactedUsers, giveaway.winners);

          giveawayMessage.edit(
            `:tada: **GIVEAWAY ENDED** :tada:`,
            embeds
              .normal(
                guildData,
                giveaway.prize,
                `${giveaway.winners > 1 ? `Winners` : `Winner`}: ${winners
                  .map((x: User) => `<@${x.id}>`)
                  .join(", ")}`
              )
              .setFooter(
                `${
                  giveaway.winners > 1 ? `${giveaway.winners} Winners | ` : ``
                }Ended at`
              )
              .setTimestamp(Date.now())
          );

          giveawayChannel.send(
            `Congratulations ${winners
              .map((x: User) => `<@${x.id}>`)
              .join(", ")}! You${giveaway.winners > 1 ? ` guys ` : ` `}won **${
              giveaway.prize
            }**.\n${giveawayMessage.url}`
          );
        }

        giveaway.ended = true;
        await giveaway.save();
      });

      // Temp Mutes
      const muteCursor = MuteModel.find({
        endsAt: { $lte: new Date() },
      }).cursor();

      muteCursor.on("data", async (muteData) => {
        const guild = client.guilds.resolve(muteData.guildId);
        if (!guild) return await MuteModel.deleteOne(muteData);

        const member = guild.members.resolve(muteData.userId);
        if (!member) return await MuteModel.deleteOne(muteData);

        const guildData = await GuildModel.findOne({
          guildId: muteData.guildId,
        });
        if (!guildData) return await MuteModel.deleteOne(muteData);

        const muteRole = guild.roles.cache.find(
          (x) => x.name === guildData.roles.mute
        );
        if (!muteRole) return await MuteModel.deleteOne(muteData);

        if (member.roles.cache.has(muteRole.id)) {
          member.roles.remove(muteRole);
        }

        return await MuteModel.deleteOne(muteData);
      });

      // Temp Bans
      const bansCursor = BanModel.find({
        endsAt: { $lte: new Date() },
      }).cursor();

      bansCursor.on("data", async (banData) => {
        const guild = client.guilds.resolve(banData.guildId);
        if (!guild) return await BanModel.deleteOne(banData);

        const member = guild.members.resolve(banData.userId);
        if (!member) return await BanModel.deleteOne(banData);

        const bannedUser = (await guild.fetchBans()).find(
          (user) => user.user.id === banData.userId
        );
        if (!bannedUser) return await BanModel.deleteOne(banData);

        guild.members.unban(bannedUser.user.id);
        await BanModel.deleteOne(banData);
      });
    }, 25e3);
  }
}
