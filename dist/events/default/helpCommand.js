"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = __importDefault(require(".."));
const guild_1 = require("../../models/guild");
const embeds_1 = __importDefault(require("../../utils/embeds"));
const react_1 = __importDefault(require("../../utils/react"));
const storage_1 = require("../../utils/storage");
class HelpCmdBack extends __1.default {
    constructor() {
        super(...arguments);
        this.name = "messageReactionAdd";
    }
    async handle(client, reaction, user) {
        if (user.bot)
            return;
        if (reaction.message.partial)
            reaction.message.fetch();
        const message = reaction.message;
        const embed = message.embeds[0];
        const guildData = (await guild_1.GuildModel.findOne({
            guildId: message.guild.id,
        })) ||
            (await guild_1.GuildModel.create({
                guildId: message.guild.id,
            }));
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
        if (reaction.emoji.name === "◀️") {
            if (embed &&
                embed.description &&
                embed.timestamp &&
                embed.title &&
                embed.title.includes(" | Commands Info")) {
                await message.reactions.removeAll();
                const mainHelp = await message.edit(helpEmbed);
                const emojisForGroups = storage_1.emojis.slice(0, groups.length);
                await react_1.default(mainHelp, emojisForGroups);
                mainHelp
                    .awaitReactions((r, u) => u.id === user.id && emojisForGroups.includes(r.emoji.name), { max: 1, time: 60000, errors: ["time"] })
                    .then(async (category) => {
                    const categoryName = toTitleCase(groups[emojisForGroups.indexOf(category.first().emoji.name)]);
                    const groupInfo = help.get(categoryName);
                    const description = groupInfo.commands
                        .map((x, i) => `**${guildData.prefix}${x}** ~ ${groupInfo.descriptions[i]}`)
                        .join("\n");
                    await mainHelp.reactions.removeAll();
                    await mainHelp.edit(embeds_1.default.normal(categoryName + ` | Commands Info`, description));
                    await react_1.default(mainHelp, ["◀️"]);
                })
                    .catch(() => message.reactions.removeAll());
            }
        }
    }
}
exports.default = HelpCmdBack;
function toTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
