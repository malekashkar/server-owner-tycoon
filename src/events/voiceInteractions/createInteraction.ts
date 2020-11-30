import { GuildMember, Speaking } from "discord.js";
import Event, { EventNameType } from "..";
import { VoiceInteractionModel } from "../../models/voiceInteraction";

export default class CreateVoiceInteraction extends Event {
  name: EventNameType = "guildMemberSpeaking";

  async handle(member: GuildMember) {
    if (member.user.bot) return;

    const channel = member.voice?.channel;
    if (!channel) return;

    const membersInChannel = channel.members;
    if (!membersInChannel.size) return;

    const voiceInteraction = await VoiceInteractionModel.findOne({
      userId: member.id,
    });

    if (voiceInteraction) {
      if (voiceInteraction.lastSpeakingTime - Date.now() > 60 * 1000) {
        await voiceInteraction.updateOne({ $inc: { speakingTimes: 1 } });
      }
    } else {
      await VoiceInteractionModel.create({
        userId: member.id,
        joinedTimestamp: Date.now(),
        lastSpeakingTime: Date.now(),
        speakingTimes: 1,
      });
    }
  }
}
