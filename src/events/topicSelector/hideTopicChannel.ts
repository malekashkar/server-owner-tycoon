import { VoiceState } from "discord.js";
import Event, { EventNameType } from "..";
import { channels, voiceTopics } from "../../utils/storage";

export default class HideTopicChannel extends Event {
  name: EventNameType = "voiceStateUpdate";

  async handle(oldState: VoiceState, newState: VoiceState) {
    if (oldState.channel !== newState.channel) {
      if (!voiceTopics.map((x) => x.channelId).includes(newState.channelID)) {
        const topicChannel = newState.guild.channels.resolve(
          channels.topicSelection
        );
        if (topicChannel) {
          topicChannel.updateOverwrite(newState.member.id, {
            VIEW_CHANNEL: false,
          });
        }
      }
    }
  }
}
