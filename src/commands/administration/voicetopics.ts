import { DocumentType } from "@typegoose/typegoose";
import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { emojis, voiceTopics } from "../../utils/storage";

export default class VoiceTopicsCommand extends AdminCommand {
  cmdName = "voicetopics";
  description = "Send the lobby voice message with all topics.";
  permissions = ["admin"];

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const voiceTopicsEmojis = emojis.slice(0, voiceTopics.length);
    const voiceTopicsMessage = await message.channel.send(
      embeds.normal(
        `Voice Channel Lobby`,
        stripIndents`${voiceTopics
          .map((x, i) => {
            const channel = message.guild.channels.resolve(x.channelId);
            if (channel) return `${voiceTopicsEmojis[i]} ${channel.name}`;
          })
          .filter((x) => !!x)
          .join("\n")}`
      )
    );
    await react(voiceTopicsMessage, voiceTopicsEmojis);

    guildData.messages.voiceTopics = voiceTopicsMessage.id;
    await guildData.save();
  }
}
