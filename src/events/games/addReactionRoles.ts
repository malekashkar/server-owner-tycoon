import { MessageReaction, TextChannel, User } from "discord.js";
import Event from "..";
import { GuildModel } from "../../models/guild";
import { UserModel, ReactionRolesUsed } from "../../models/user";
import { reactionRoles } from "../../utils/storage";
import givePoints from "../../utils/points"

export default class ReactionRoles extends Event {
  name = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (!(reaction.message.channel instanceof TextChannel)) return;

    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const roleInfo = reactionRoles.find(
      (x) => x.reaction === reaction.emoji.name
    );
    if (!roleInfo) return;

    const message = reaction.message;
    const guildData =
      (await GuildModel.findOne({ guildId: message.guild.id })) ||
      (await GuildModel.create({ guildId: message.guild.id }));

    if (guildData.messages.reactionRoles === message.id) {
      const member = message.guild.members.resolve(user.id);
      if (member?.roles?.cache?.has(roleInfo.roleId)) return;

      member.roles.add(roleInfo.roleId);

      const userData =
        (await UserModel.findOne({ userId: user.id })) ||
        (await UserModel.create({ userId: user.id }));

      if (
        !userData.gameCooldowns.reactionRoles[
          roleInfo.name as keyof ReactionRolesUsed
        ]
      ) {
        await givePoints(user, "reactionRoles");
        userData.gameCooldowns.reactionRoles[
          roleInfo.name as keyof ReactionRolesUsed
        ] = true;
        await userData.save();
      }
    }
  }
}
