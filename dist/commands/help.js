"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embeds_1 = __importDefault(require("../utils/embeds"));
const _1 = __importDefault(require("."));
const discord_js_1 = require("discord.js");
const storage_1 = require("../utils/storage");
const react_1 = __importDefault(require("../utils/react"));
class HelpCommand extends _1.default {
    constructor() {
        super(...arguments);
        this.cmdName = "help";
        this.description = "Receive the help message with all the information of the bot.";
    }
    async run(client, message, args, userData, guildData) {
        const help = new discord_js_1.Collection();
        for (const commandObj of client.commands.array()) {
            if (!commandObj.group)
                continue;
            const command = commandObj.isSubCommand
                ? commandObj.group + ` ${commandObj.cmdName}`
                : commandObj.cmdName;
            const group = help.get(toTitleCase(commandObj.group));
            if (!group) {
                help.set(toTitleCase(commandObj.group), {
                    commands: [command],
                    descriptions: [commandObj.description],
                });
            }
            else {
                group.commands.push(command);
                group.descriptions.push(commandObj.description);
            }
        }
        const groups = Array.from(help).map(([name, value]) => name);
        const fields = groups.map((name, i) => {
            return {
                name: `**${name}** commands`,
                value: `*react with ${storage_1.emojis[i]} to view*`,
                inline: true,
            };
        });
        const helpEmbed = embeds_1.default
            .normal(`Help Menu`, `Below are all the help groups, click one of the emojis to see the commands.`)
            .addFields(fields);
        const emojisForGroups = storage_1.emojis.slice(0, groups.length);
        const helpMessage = await message.channel.send(helpEmbed);
        await react_1.default(helpMessage, emojisForGroups);
        helpMessage
            .awaitReactions((r, u) => u.id === message.author.id && emojisForGroups.includes(r.emoji.name), { max: 1, time: 60000, errors: ["time"] })
            .then(async (category) => {
            const categoryName = toTitleCase(groups[emojisForGroups.indexOf(category.first().emoji.name)]);
            const groupInfo = help.get(categoryName);
            const description = groupInfo.commands
                .map((x, i) => `**${guildData.prefix}${x}** ~ ${groupInfo.descriptions[i]}`)
                .join("\n");
            helpMessage.reactions.removeAll();
            helpMessage.edit(embeds_1.default.normal(categoryName + ` | Commands Info`, description));
            await react_1.default(helpMessage, ["◀️"]);
        })
            .catch(async () => await helpMessage.reactions.removeAll());
    }
}
exports.default = HelpCommand;
function toTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
