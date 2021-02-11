import { GuildMember } from "discord.js";
import Event, { EventNameType } from "..";
import { VoiceInteractionModel } from "../../models/voiceInteraction";

export default class StartVoiceInteraction extends Event {
  name: EventNameType = "guildMemberSpeaking";

  async handle(member: GuildMember) {
    if (member.user.bot) return;
    if (!member.voice?.channel?.members?.size) return;

    const voiceInteraction = await VoiceInteractionModel.findOne({
      userId: member.id,
    });

    if (voiceInteraction) {
      if (Date.now() - voiceInteraction.lastSpeakingTime > 60 * 1000) {
        voiceInteraction.lastSpeakingTime = Date.now();
        voiceInteraction.speakingTimes += 1;
        await voiceInteraction.save();
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
