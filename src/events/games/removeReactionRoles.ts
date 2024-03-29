import { MessageReaction, User } from "discord.js";
import Event from "..";
import { GuildModel } from "../../models/guild";
import { reactionRoles } from "../../utils/storage";

export default class ReactionRoles extends Event {
  name = "messageReactionRemove";

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
      if (!member?.roles?.cache?.has(roleInfo.roleId)) return;

      member.roles.remove(roleInfo.roleId);
    }
  }
}
