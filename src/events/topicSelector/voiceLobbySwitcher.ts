import { MessageReaction, TextChannel, User, VoiceChannel } from "discord.js";
import { upperFirst } from "lodash";
import Event, { EventNameType } from "..";
import { GuildModel } from "../../models/guild";
import { emojis, voiceTopics } from "../../utils/storage";

export default class VoiceLobbySwitcher extends Event {
  name: EventNameType = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (!(reaction.message.channel instanceof TextChannel)) return;

    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;
    const topicEmojis = emojis.slice(0, voiceTopics.length);
    if (topicEmojis.includes(reaction.emoji.name)) {
      const guildData = await GuildModel.findOne({
        guildId: message.guild.id,
      });

      if (message.id === guildData.messages.voiceTopics) {
        reaction.users.remove(user);
        const member = message.guild.members.resolve(user);
        if (
          voiceTopics.map((x) => x.channelId).includes(member?.voice?.channelID)
        ) {
          const chosenTopic =
            voiceTopics[topicEmojis.indexOf(reaction.emoji.name)];
          if (member?.voice?.channelID !== chosenTopic.channelId) {
            member.voice.setChannel(chosenTopic.channelId);
          }
        }
      }
    }
  }
}
