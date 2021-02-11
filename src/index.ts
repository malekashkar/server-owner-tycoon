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
      partials: ["USER", "REACTION", "MESSAGE"],
      ws: {
        intents: [
          "GUILD_MEMBERS",
          "GUILDS",
          "GUILD_VOICE_STATES",
          "GUILD_INVITES",
          "GUILD_MESSAGES",
          "GUILD_MESSAGE_REACTIONS",
          "DIRECT_MESSAGES",
          "DIRECT_MESSAGE_REACTIONS",
        ],
      },
    });

    this.login(process.env.TOKEN);
    this.loadDatabase();
    this.loadCommands();
    this.loadEvents();
  }

  private loadDatabase() {
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

  private loadCommands(location = path.join(__dirname, "commands")) {
    const directoryStats = fs.statSync(location);
    if (directoryStats.isDirectory()) {
      const commandFiles = fs.readdirSync(location);
      for (const commandFile of commandFiles) {
        const commandPath = path.join(location, commandFile);
        const commandFileStats = fs.statSync(commandPath);
        if (commandFileStats.isFile()) {
          if (path.parse(commandPath).name === "index") continue;
          if (/^.*\.(js|ts|jsx|tsx)$/i.test(commandFile)) {
            const tmpCommand = require(commandPath);
            const command =
              typeof tmpCommand !== "function" &&
              typeof tmpCommand.default === "function"
                ? tmpCommand.default
                : typeof tmpCommand === "function"
                ? tmpCommand
                : null;
            if (command) {
              try {
                const commandObj: Command = new command(this);
                if (commandObj && commandObj.cmdName) {
                  if (!this.commands) this.commands = new Collection();
                  if (this.commands.has(commandObj.cmdName)) {
                    throw `Duplicate command name ${commandObj.cmdName}`;
                  } else {
                    this.commands.set(
                      commandObj.cmdName.toLowerCase(),
                      commandObj
                    );
                  }
                }
              } catch (ignored) {}
            }
          }
        } else {
          this.loadCommands(commandPath);
        }
      }
    }
  }

  private loadEvents(location = path.join(__dirname, "events")) {
    const directoryStats = fs.statSync(location);
    if (directoryStats.isDirectory()) {
      const eventFiles = fs.readdirSync(location);
      for (const eventFile of eventFiles) {
        const eventPath = path.join(location, eventFile);
        const eventFileStats = fs.statSync(eventPath);
        if (eventFileStats.isFile()) {
          if (path.parse(eventPath).name === "index") continue;
          if (/^.*\.(js|ts|jsx|tsx)$/i.test(eventFile)) {
            const tmpEvent = require(eventPath);
            const event =
              typeof tmpEvent !== "function" &&
              typeof tmpEvent.default === "function"
                ? tmpEvent.default
                : typeof tmpEvent === "function"
                ? tmpEvent
                : null;
            if (event) {
              try {
                const eventObj: Event = new event(this);
                if (eventObj && eventObj.name) {
                  this.addListener(eventObj.name, async (...args) => {
                    eventObj.handle.bind(eventObj)(...args, eventObj.name);
                  });
                }
              } catch (ignored) {}
            }
          }
        } else {
          this.loadEvents(eventPath);
        }
      }
    }
  }
}

new Client();
