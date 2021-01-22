import fs from "fs";
import _ from "lodash";
import path from "path";
import mongoose from "mongoose";
import Event from "./events";
import Command from "./commands";
import logger from "./utils/logger";
import dotenv from "dotenv";
import {
  Client as BaseManager,
  Collection,
  Invite,
  ClientOptions,
} from "discord.js";

dotenv.config();

export default class Client extends BaseManager {
  commands: Collection<string, Command> = new Collection();
  invites: Collection<string, Collection<string, Invite>> = new Collection();

  constructor(options?: ClientOptions) {
    super({
      ...options,
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
      ws: {
        intents: [
          "GUILDS",
          "GUILD_MEMBERS",
          "GUILD_VOICE_STATES",
          "GUILD_INVITES",
          "GUILD_VOICE_STATES",
          "GUILD_MESSAGES",
          "GUILD_MESSAGE_REACTIONS",
          "DIRECT_MESSAGES",
          "DIRECT_MESSAGE_REACTIONS",
        ],
      },
    });

    this.loadDatabase();
    this.loadCommands();
    this.loadEvents();
  }

  loadDatabase() {
    mongoose.connect(
      process.env.MONGO_URL,
      {
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
  }

  loadCommands(directory: string = path.join(__dirname, "commands")) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return;

    const commandFiles = fs.readdirSync(directory);
    for (const commandFile of commandFiles) {
      const commandPath = path.join(directory, commandFile);
      const commandFileStats = fs.statSync(commandPath);
      if (!commandFileStats.isFile()) {
        this.loadCommands(commandPath);
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
        if (commandObj && commandObj.cmdName) {
          if (this.commands.has(commandObj.cmdName)) {
            logger.error(
              `DUPLICATE_COMMAND`,
              `Duplicate command ${commandObj.cmdName}.`
            );
          } else this.commands.set(commandObj.cmdName, commandObj);
        }
      } catch (e) {}
    }
  }

  loadEvents(directory = path.join(__dirname, "events")) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return;

    const eventFiles = fs.readdirSync(directory);
    for (const eventFile of eventFiles) {
      const eventPath = path.join(directory, eventFile);
      const eventFileStats = fs.statSync(eventPath);
      if (!eventFileStats.isFile()) {
        this.loadEvents(eventPath);
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
        if (eventObj && eventObj.name) {
          this.addListener(eventObj.name, (...args) =>
            eventObj.handle.bind(eventObj)(...args)
          );
        }
      } catch (ignored) {}
    }
  }
}

new Client().login(process.env.TOKEN);
