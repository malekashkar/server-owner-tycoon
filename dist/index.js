"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./utils/logger"));
const client_1 = __importDefault(require("./structures/client"));
// Comment this before pushing.
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "..", ".env") });
// This is only needed for heroku.
const app = express_1.default();
app.listen(process.env.PORT || 5000);
app.get("/");
class Main extends client_1.default {
    constructor(options) {
        super({
            partials: ["USER", "GUILD_MEMBER", "MESSAGE", "REACTION"],
            ws: {
                intents: [
                    "GUILDS",
                    "GUILD_MEMBERS",
                    "GUILD_VOICE_STATES",
                    "GUILD_INVITES",
                    "GUILD_VOICE_STATES",
                    "GUILD_MESSAGES",
                    "GUILD_MESSAGE_REACTIONS",
                ],
            },
            ...options,
        });
        this.login(process.env.TOKEN);
        logger_1.default.info("BOT", `Logging into server owner tycoon bot.`);
        this.loadDatabase(process.env.MONGO_URL);
        logger_1.default.info("DATABASE", `The database is connecting.`);
        this.loadCommands();
        this.loadEvents();
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
    loadCommands(directory = path_1.default.join(__dirname, "commands")) {
        const directoryStats = fs_1.default.statSync(directory);
        if (!directoryStats.isDirectory())
            return;
        const commandFiles = fs_1.default.readdirSync(directory);
        for (const commandFile of commandFiles) {
            const commandPath = path_1.default.join(directory, commandFile);
            const commandFileStats = fs_1.default.statSync(commandPath);
            if (!commandFileStats.isFile()) {
                this.loadCommands(commandPath);
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
                    if (this.commands.has(commandObj.cmdName)) {
                        logger_1.default.error(`DUPLICATE_COMMAND`, `Duplicate command ${commandObj.cmdName}.`);
                    }
                    else
                        this.commands.set(commandObj.isSubCommand
                            ? commandObj.group + `_${commandObj.cmdName}`
                            : commandObj.cmdName, commandObj);
                }
            }
            catch (e) { }
        }
    }
    loadEvents(directory = path_1.default.join(__dirname, "events")) {
        const directoryStats = fs_1.default.statSync(directory);
        if (!directoryStats.isDirectory())
            return;
        const eventFiles = fs_1.default.readdirSync(directory);
        for (const eventFile of eventFiles) {
            const eventPath = path_1.default.join(directory, eventFile);
            const eventFileStats = fs_1.default.statSync(eventPath);
            if (!eventFileStats.isFile()) {
                this.loadEvents(eventPath);
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
                    this.addListener(eventObj.name, (...args) => eventObj.handle.bind(eventObj)(this, ...args));
                }
            }
            catch (ignored) { }
        }
    }
}
exports.default = Main;
new Main();
