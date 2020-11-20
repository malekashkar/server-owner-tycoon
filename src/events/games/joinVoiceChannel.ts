import { TextChannel, VoiceState } from "discord.js";
import Event from "..";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";
import { gameInfo, givePoints } from "../../utils/storage";

export default class JoinVoiceChannel extends Event {
  name = "voiceStateUpdate";

  async handle(oldState: VoiceState, newState: VoiceState) {
    if (!newState.channel) return;

    const userData =
      (await UserModel.findOne({
        userId: newState.member.id,
      })) ||
      (await UserModel.create({
        userId: newState.member.id,
      }));

    if (
      !userData.gameCooldowns.joinVoiceChannel ||
      userData.gameCooldowns.joinVoiceChannel.getTime() +
        gameInfo.joinVoiceChannel.cooldown <
        Date.now()
    ) {
      const user = this.client.users.resolve(newState.member.id);
      await givePoints(user, "joinVoiceChannel");

      userData.gameCooldowns.joinVoiceChannel = new Date();
      await userData.save();
    }
  }
}
