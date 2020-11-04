"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class embeds {
}
exports.default = embeds;
embeds.error = function (err, title = "Error Caught") {
    return new discord_js_1.MessageEmbed()
        .setTitle(title)
        .setDescription(`${err}`)
        .setColor("RED")
        .setTimestamp();
};
embeds.normal = function (title, desc) {
    return new discord_js_1.MessageEmbed()
        .setTitle(title)
        .setDescription(desc)
        .setColor("RANDOM")
        .setTimestamp();
};
embeds.question = function (question) {
    return new discord_js_1.MessageEmbed()
        .setTitle(question)
        .setDescription(`You have 15 minutes to reply to the question above.`)
        .setColor("RANDOM")
        .setTimestamp();
};
