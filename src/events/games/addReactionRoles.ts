import { MessageReaction, TextChannel, User } from "discord.js";
import Event from "..";
import { GuildModel } from "../../models/guild";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";
import {
  gamePoints,
  ReactionRoleNames,
  reactionRoles,
} from "../../utils/storage";

export default class ReactionRoles extends Event {
  name = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
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
          roleInfo.name as ReactionRoleNames
        ]
      ) {
        const points = Math.floor(Math.random() * gamePoints.reactionRoles);
        userData.points += points;
        await userData.save();

        const pointChannel = this.client.guilds
          .resolve(this.client.mainGuild)
          .channels.resolve(this.client.pointChannel) as TextChannel;

        pointChannel.send(
          embeds.normal(
            `Reaction Role Redeemed`,
            `${user} has received **${points}** points for redeeming the **${roleInfo.name}** reaction role.`
          )
        );

        userData.gameCooldowns.reactionRoles[
          roleInfo.name as ReactionRoleNames
        ] = true;
        await userData.save();
      }
    }
  }
}
