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
    const embed = new MessageEmbed().setColor("RANDOM").setTimestamp();
    if (title) embed.setTitle(title);
    if (desc) embed.setDescription(desc);
    return embed;
  };

  static question = function (question: string) {
    return new MessageEmbed()
      .setTitle(question)
      .setDescription(`You have 15 minutes to reply to the question above.`)
      .setColor("RANDOM")
      .setTimestamp();
  };
}
