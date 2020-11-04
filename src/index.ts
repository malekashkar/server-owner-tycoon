import fs from "fs";
import _ from "lodash";
import path from "path";
import mongoose from "mongoose";
import express from "express";
import Event from "./events";
import Command from "./commands";
import logger from "./utils/logger";
import Client from "./structures/client";
import { ClientOptions } from "discord.js";

const app = express();
app.listen(process.env.PORT || 5000);
app.get("/");

export default class Main extends Client {
  constructor(options?: ClientOptions) {
    super({
      ...options,
    });

    this.login(process.env.TOKEN);
    logger.info("BOT", `Logging into server owner tycoon bot.`);

    this.loadDatabase(process.env.MONGO_URL);
    console.log(process.env.MONGO_URL);
    logger.info("DATABASE", `The database is connecting.`);

    this.loadCommands();
    this.loadEvents();
  }

  loadDatabase(url: string) {
    mongoose.connect(
      url,
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
          } else
            this.commands.set(
              commandObj.isSubCommand
                ? commandObj.group + `_${commandObj.cmdName}`
                : commandObj.cmdName,
              commandObj
            );
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
            eventObj.handle.bind(eventObj)(this, ...args)
          );
        }
      } catch (ignored) {}
    }
  }
}

new Main();
