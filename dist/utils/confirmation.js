"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embeds_1 = __importDefault(require("./embeds"));
const react_1 = __importDefault(require("./react"));
async function confirmation(title, text, message) {
    const emojis = {
        yes: "✅",
        no: "❎",
    };
    const msg = await message.channel.send(embeds_1.default.normal(title, `${text}\nYou have 30 seconds to react with the ${emojis.yes} or ${emojis.no}.`));
    await react_1.default(msg, [emojis.yes, emojis.no]);
    const reactions = await msg.awaitReactions((reaction, user) => user.id === message.author.id &&
        Object.values(emojis).includes(reaction.emoji.name), { max: 1, time: 30000 });
    if (msg.deletable)
        msg.delete();
    if (!reactions.size || reactions.first().emoji.name !== emojis.yes)
        return false;
    else
        return true;
}
exports.default = confirmation;
