import { GuildMember } from "discord.js";
import Event from ".";
import { UserModel } from "../models/user";

export default class ResetOnLeave extends Event {
  name = "guildMemberRemove";

  async handle(member: GuildMember) {
    await UserModel.deleteOne({
      userId: member.id,
    });
  }
}