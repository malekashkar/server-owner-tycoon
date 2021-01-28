import { DocumentType } from "@typegoose/typegoose";
import { Message, MessageEmbed } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import react from "../../utils/react";

export default class NewCommand extends AdminCommand {
  cmdName = "new";
  description = "Create a new ticket panel menu for users to create tickets.";
  permissions = ["admin", "human", "mod"];

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const emojis = ["❓", "💰", "🤖", "💡", "⭐", "🎵"];
    const embed = new MessageEmbed()
      .setAuthor(`Server Owner Tycoon`)
      .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`Open a Support Ticket`)
      .addField(
        `General Support`,
        `React with ❓ to speak to a member of the support team regarding a general question.`
      )
      .addField(
        `Billing & Donations`,
        `React with 💰 to speak to a member of the support team or sales team regarding a billing or donation enquiry.`
      )
      .addField(
        `Bug Reports`,
        `React with 🤖 to make a bug report. Please do not use this category for technical support as we only review these tickets once archived.`
      )
      .addField(
        `Suggestions`,
        `React with 💡 to make a suggestion. Please do not use this category for feedback as we only review these tickets once archived.`
      )
      .addField(
        `Get Involved`,
        `React with ⭐ to speak with a member of the support team or human resource team about opportunities to get involved - for example volunteering or applying for a job.`
      )
      .addField(
        `Media Inquiry`,
        `React with 🎵 to speak with a member of the support team about any media enquiries - for example news articles, content creation, or an interview with our management team!`
      )
      .setFooter(`Server Owner Tycoon`)
      .setColor("RANDOM");
    const panelMessage = await message.channel.send(embed);
    await react(panelMessage, emojis);

    guildData.messages.ticketPanel = panelMessage.id;
    guildData.channels.ticketPanel = panelMessage.channel.id;
    await guildData.save();
  }
}
