"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const embeds_1 = __importDefault(require("./embeds"));
async function question(question, questionForId, message, required) {
    const msg = await message.channel.send(embeds_1.default.question(question));
    const answer = await message.channel.awaitMessages((x) => x.author.id === questionForId && required && required.length
        ? required.includes(x.content)
        : true, {
        max: 1,
        time: 900000,
        errors: ["time"],
    });
    if (msg.deletable)
        msg.delete();
    if (answer.first().deletable)
        answer.first().delete();
    return answer ? answer.first().content : null;
}
exports.default = question;
