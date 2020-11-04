"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
const guild_1 = require("../../models/guild");
const user_1 = require("../../models/user");
const __1 = __importDefault(require(".."));
class commandHandler extends __1.default {
    constructor() {
        super(...arguments);
        this.name = "message";
    }
    async handle(client, message) {
        try {
            if (!message.guild || !message.author || message.author.bot)
                return;
            const guildData = (await guild_1.GuildModel.findOne({ guildId: message.guild.id })) ||
                (await guild_1.GuildModel.create({
                    guildId: message.guild.id,
                }));
            const userData = (await user_1.UserModel.findOne({
                userId: message.author.id,
            })) ||
                (await user_1.UserModel.create({
                    userId: message.author.id,
                }));
            const prefix = guildData.prefix;
            if (!prefix || message.content.indexOf(prefix) !== 0)
                return;
            const args = message.content
                .slice(prefix.length)
                .trim()
                .replace(/ /g, "\n")
                .split(/\n+/g);
            let command = args.shift().toLowerCase();
            for (const commandObj of client.commands.array()) {
                if (commandObj.disabled)
                    return;
                if ((args.length &&
                    commandObj.isSubCommand &&
                    commandObj.group.toLowerCase() === command.toLowerCase() &&
                    commandObj.cmdName.toLowerCase() === args[0].toLowerCase()) ||
                    (commandObj.cmdName.toLowerCase() === command &&
                        !commandObj.isSubCommand)) {
                    if (commandObj.isSubCommand) {
                        command = `${commandObj.group} ${args.shift()}`;
                    }
                    commandObj
                        .run(client, message, args, userData, guildData)
                        .catch((err) => logger_1.default.error(`${command.toUpperCase()}_ERROR`, err));
                }
            }
        }
        catch (err) {
            logger_1.default.error("COMMAND_HANDLER", err);
        }
    }
}
exports.default = commandHandler;
