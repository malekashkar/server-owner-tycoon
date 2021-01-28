import {
  MessageReaction,
  OverwriteResolvable,
  User,
} from "discord.js";
import Event, { EventNameType } from "..";
import { GuildModel } from "../../models/guild";
import { TicketModel } from "../../models/ticket";
import embeds from "../../utils/embeds";
import {
  categories,
  ticketEmojis,
  ticketPermissions,
  TicketTypes,
} from "../../utils/storage";

export default class OpenTicket extends Event {
  name: EventNameType = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;
    const guildData =
      (await GuildModel.findOne({ guildId: message.guild.id })) ||
      (await GuildModel.create({ guildId: message.guild.id }));

    if (guildData.messages?.ticketPanel === message.id) {
      await reaction.users.remove(user);

      const ticketType = Object.entries(ticketEmojis).find(
        (x) => x[1] === reaction.emoji.name
      )[0] as TicketTypes;
      const username =
        user.username.length < 15 ? user.username : user.username.slice(0, 15);

      const permissionOverwrites: OverwriteResolvable[] = [
        {
          id: user.id,
          allow: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"],
        },
        {
          id: message.guild.id,
          deny: "VIEW_CHANNEL",
        },
      ];
      for (const roleName of ticketPermissions[ticketType]) {
        const role = message.guild.roles.cache.find(
          (x) => x.name.toLowerCase() === roleName.toLowerCase()
        );
        if (role) {
          permissionOverwrites.push({
            id: role.id,
            allow: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"],
          });
        }
      }

      const channel = await message.guild.channels.create(
        `${ticketEmojis[ticketType]}${ticketType}-${username}`,
        {
          type: "text",
          parent: categories.tickets,
          permissionOverwrites,
          reason: `${user.username} opened a ${ticketType} ticket.`,
        }
      );

      await channel.send(
        embeds.normal(
          `Hey ${username}!`,
          `Please be patient, the support team will be here to support you as soon as possible!`
        )
      );

      await TicketModel.create({
        userId: user.id,
        channelId: channel.id,
      });
    }
  }
}
