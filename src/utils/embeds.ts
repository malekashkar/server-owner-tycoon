import { MessageEmbed } from "discord.js";

export default class embeds {
  static error = function (err: string, title = "Error Caught") {
    return new MessageEmbed()
      .setTitle(title)
      .setDescription(`${err}`)
      .setColor("RED")
      .setTimestamp();
  };

  static normal = function (title: string, desc: string) {
    return new MessageEmbed()
      .setTitle(title)
      .setDescription(desc)
      .setColor("RANDOM")
      .setTimestamp();
  };

  static question = function (question: string) {
    return new MessageEmbed()
      .setTitle(question)
      .setDescription(`You have 15 minutes to reply to the question above.`)
      .setColor("RANDOM")
      .setTimestamp();
  };
}
