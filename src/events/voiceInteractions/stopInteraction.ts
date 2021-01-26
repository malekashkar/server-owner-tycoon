import { GuildMember } from "discord.js";
import Event, { EventNameType } from "..";
import { VoiceInteractionModel } from "../../models/voiceInteraction";
import givePoints from "../../utils/points";

export default class CreateVoiceInteraction extends Event {
  name: EventNameType = "guildMemberUpdate";

  async handle(oldMember: GuildMember, newMember: GuildMember) {
    if (newMember.user.bot) return;
    if (oldMember.voice?.channel !== newMember.voice?.channel) {
      const voiceInteraction = await VoiceInteractionModel.findOne({
        userId: newMember.id,
      });

      if (voiceInteraction) {
        if (voiceInteraction.speakingTimes > 10) {
          await givePoints(newMember.user, "voiceInteraction");
        }
        await voiceInteraction.deleteOne();
      }
    }
  }
}
