import { TextChannel, VoiceState } from "discord.js";
import Event from "..";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";
import { gameCooldowns, gamePoints } from "../../utils/storage";

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
        gameCooldowns.joinVoiceChannel <
        Date.now()
    ) {
      const points = Math.floor(Math.random() * gamePoints.joinVoiceChannel);

      userData.points += points;
      userData.gameCooldowns.joinVoiceChannel = new Date();
      await userData.save();

      const pointChannel = this.client.guilds
        .resolve(this.client.mainGuild)
        .channels.resolve(this.client.pointChannel) as TextChannel;

      pointChannel.send(
        embeds.normal(
          `Points Received`,
          `${newState.member.user} has received **${points}** for joining **${newState.channel.name}**.`
        )
      );
    }
  }
}
