import { GuildMember, VoiceState } from "discord.js";
import Event from "..";
import { UserModel } from "../../models/user";
import Client from "../../structures/client";
import embeds from "../../utils/embeds";
import { gameCooldowns, gamePoints } from "../../utils/storage";

export default class JoinVoiceChannel extends Event {
  name = "voiceStateUpdate";

  async handle(client: Client, oldState: VoiceState, newState: VoiceState) {
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
        gameCooldowns.joinVoiceChannel <
        Date.now()
    ) {
      const points = Math.floor(Math.random() * gamePoints.joinVoiceChannel);

      userData.points += points;
      userData.gameCooldowns.joinVoiceChannel = new Date();
      await userData.save();

      newState.member.user
        .send(
          embeds.normal(
            `Points Received`,
            `You received **${points}** for joining **${newState.channel.name}**.`
          )
        )
        .catch(() => undefined);
    }
  }
}
