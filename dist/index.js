"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./utils/logger"));
class Main {
    constructor(client) {
        client.login(process.env.TOKEN);
        logger_1.default.info("BOT", `Logging into bot with ID "${client.user.id}".`);
        this.loadDatabase(process.env.MONGO_URL);
        logger_1.default.info("DATABASE", `The database is connecting.`);
        this.loadCommands(client);
        this.loadEvents(client);
    }
    loadDatabase(url) {
        mongoose_1.default.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            connectTimeoutMS: 60000,
            socketTimeoutMS: 60000,
            serverSelectionTimeoutMS: 60000,
        }, (err) => {
            if (err)
                logger_1.default.error("DATABASE", err);
            else
                logger_1.default.info("DATABASE", `The database has been connected successfully.`);
        });
    }
    loadCommands(client, directory = path_1.default.join(__dirname, "commands")) {
        const directoryStats = fs_1.default.statSync(directory);
        if (!directoryStats.isDirectory())
            return;
        const commandFiles = fs_1.default.readdirSync(directory);
        for (const commandFile of commandFiles) {
            const commandPath = path_1.default.join(directory, commandFile);
            const commandFileStats = fs_1.default.statSync(commandPath);
            if (!commandFileStats.isFile()) {
                this.loadCommands(client, commandPath);
                continue;
            }
            if (!commandFileStats.isFile() ||
                !/^.*\.(js|ts|jsx|tsx)$/i.test(commandFile) ||
                path_1.default.parse(commandPath).name === "index")
                continue;
            const tmpCommand = require(commandPath);
            const command = typeof tmpCommand !== "function" &&
                typeof tmpCommand.default === "function"
                ? tmpCommand.default
                : typeof tmpCommand === "function"
                    ? tmpCommand
                    : null;
            try {
                const commandObj = new command(this);
                if (commandObj && commandObj.cmdName) {
                    if (client.commands.has(commandObj.cmdName)) {
                        logger_1.default.error(`DUPLICATE_COMMAND`, `Duplicate command ${commandObj.cmdName}.`);
                    }
                    else
                        client.commands.set(commandObj.isSubCommand
                            ? commandObj.group + `_${commandObj.cmdName}`
                            : commandObj.cmdName, commandObj);
                }
            }
            catch (e) { }
        }
    }
    loadEvents(client, directory = path_1.default.join(__dirname, "events")) {
        const directoryStats = fs_1.default.statSync(directory);
        if (!directoryStats.isDirectory())
            return;
        const eventFiles = fs_1.default.readdirSync(directory);
        for (const eventFile of eventFiles) {
            const eventPath = path_1.default.join(directory, eventFile);
            const eventFileStats = fs_1.default.statSync(eventPath);
            if (!eventFileStats.isFile()) {
                this.loadEvents(client, eventPath);
                continue;
            }
            if (!eventFileStats.isFile() ||
                !/^.*\.(js|ts|jsx|tsx)$/i.test(eventFile) ||
                path_1.default.parse(eventPath).name === "index")
                continue;
            const tmpEvent = require(eventPath);
            const event = typeof tmpEvent.default === "function" ? tmpEvent.default : null;
            if (!event)
                return;
            try {
                const eventObj = new event(this);
                if (eventObj && eventObj.name) {
                    client.addListener(eventObj.name, (...args) => eventObj.handle.bind(eventObj)(client, ...args));
                }
            }
            catch (ignored) { }
        }
    }
}
exports.default = Main;
