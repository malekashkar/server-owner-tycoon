import logger from "../utils/logger";
import { GuildMember, Message, TextChannel } from "discord.js";
import { GuildModel } from "../models/guild";
import { UserModel } from "../models/user";
import Event from ".";
import GuessTheNumber from "../utils/games/guessTheNumber";
import Milestone from "../utils/games/milestones";
import reactionMessage from "../utils/games/reactionMessage";
import wordUnscramble from "../utils/games/wordUnscramble";
import embeds from "../utils/embeds";
import { channels, roles } from "../utils/storage";
import guildBoosts from "../utils/games/guildBoost";
import SaveTicketMessages from "./tickets/saveTicketMessages";

import invitesMod from "../utils/automod/invites";
import linksMod from "../utils/automod/links";
import mentionsMod from "../utils/automod/mentions";
import mentionsBan from "../utils/automod/mentionsBan";
import spamMod from "../utils/automod/spam";
import muteCheck from "../utils/automod/mute";
import textInteraction from "../utils/games/textInteraction";

export default class CommandHandler extends Event {
  name = "message";

  async handle(message: Message) {
    if (!(message.channel instanceof TextChannel) || message.author?.bot)
      return;

    try {
      const guildData =
        (await GuildModel.findOne({ guildId: message.guild.id })) ||
        (await GuildModel.create({
          guildId: message.guild.id,
        }));

      const userData =
        (await UserModel.findOne({
          userId: message.author.id,
        })) ||
        (await UserModel.create({
          userId: message.author.id,
        }));

      await GuessTheNumber(message, userData, guildData);
      await guildBoosts(message);
      await Milestone(message, userData);
      await reactionMessage(message, guildData);
      await wordUnscramble(message, userData, guildData);
      await SaveTicketMessages(message);

      if (
        !message.member.hasPermission("ADMINISTRATOR") &&
        guildData.moderation.enabled
      ) {
        if (guildData.moderation.invites) await invitesMod(message, guildData);
        if (guildData.moderation.links) await linksMod(message, guildData);
        if (guildData.moderation.mentions)
          await mentionsMod(message, guildData);
        if (guildData.moderation.mentionsBan)
          await mentionsBan(message, guildData);
        if (
          guildData.moderation.spamMessageAmount &&
          guildData.moderation.spamTime
        )
          await spamMod(message, userData, guildData);
        if (
          guildData.moderation.muteViolationAmount &&
          guildData.moderation.muteViolationInterval
        )
          await muteCheck(message, guildData);
      }

      const prefix = guildData.prefix;
      if (!prefix || message.content.indexOf(prefix) !== 0) {
        await textInteraction(message);
        return;
      }
      if (message.deletable) await message.delete();

      if (
        !message.member.hasPermission("ADMINISTRATOR") &&
        message?.channel?.id !== channels.commands
      ) {
        message.channel.send(
          embeds.error(
            `Please only use commands in the <#${channels.commands}> channel!`
          )
        );
        return;
      }

      const args = message.content
        .slice(prefix.length)
        .trim()
        .replace(/ /g, "\n")
        .split(/\n+/g);
      let command = args.shift().toLowerCase();

      for (const commandObj of this.client.commands.array()) {
        if (commandObj.disabled) return;
        if (
          (args.length &&
            commandObj.isSubCommand &&
            commandObj.group.toLowerCase() === command.toLowerCase() &&
            commandObj.cmdName.toLowerCase() === args[0].toLowerCase()) ||
          (commandObj.cmdName.toLowerCase() === command &&
            !commandObj.isSubCommand)
        ) {
          if (commandObj.isSubCommand) {
            command = `${commandObj.group} ${args.shift()}`;
          }

          if (
            commandObj.permissions.length &&
            !resolvePermissions(message.member, commandObj.permissions)
          )
            return;

          commandObj
            .run(message, args, userData, guildData)
            .catch((err) =>
              logger.error(`${command.toUpperCase()}_ERROR`, err)
            );
        }
      }
    } catch (err) {
      logger.error("COMMAND_HANDLER", err);
    }
  }
}

export function resolvePermissions(member: GuildMember, permissions: string[]) {
  let weight = 0;

  if (permissions.length) {
    for (const perm of permissions) {
      if (
        perm.toLowerCase().includes("admin") &&
        member.hasPermission("ADMINISTRATOR")
      )
        weight++;
      else if (
        perm.toLowerCase().includes("human") &&
        member.roles.cache.has(roles.humanResources)
      )
        weight++;
      else if (
        perm.toLowerCase().includes("mod") &&
        member.roles.cache.has(roles.moderator)
      )
        weight++;
      else if (
        perm.toLowerCase().includes("support") &&
        member.roles.cache.has(roles.supportTeam)
      )
        weight++;
    }
  } else weight++;

  if (weight > 0) return true;
  else false;
}
