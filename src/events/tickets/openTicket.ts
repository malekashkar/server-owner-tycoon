import {
  MessageReaction,
  OverwriteResolvable,
  TextChannel,
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
} from "../../utils/storage";

export default class OpenTicket extends Event {
  name: EventNameType = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (!(reaction.message.channel instanceof TextChannel)) return;

    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;
    const guildData =
      (await GuildModel.findOne({ guildId: message.guild.id })) ||
      (await GuildModel.create({ guildId: message.guild.id }));

    if (guildData.messages?.ticketPanel === message.id) {
      const ticketType = Object.entries(ticketEmojis).find(
        (x) => x[1] === reaction.emoji.name
      );
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
      for (const permission of Object.values(ticketPermissions)) {
        const roleName = permission[1];
        const role = message.guild.roles.cache.find((x) =>
          x.name.toLowerCase().includes(roleName)
        );
        permissionOverwrites.push({
          id: role.id,
          allow: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "VIEW_CHANNEL"],
        });
      }

      const channel = await message.guild.channels.create(
        `${ticketType[1]}${ticketType[0]}-${username}`,
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
