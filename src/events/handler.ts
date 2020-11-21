import logger from "../utils/logger";
import { Message, TextChannel } from "discord.js";
import { GuildModel } from "../models/guild";
import { UserModel } from "../models/user";
import Event from ".";
import GuessTheNumber from "../utils/games/guessTheNumber";
import Milestone from "../utils/games/milestones";
import reactionMessage from "../utils/games/reactionMessage";
import wordUnscramble from "../utils/games/wordUnscramble";
import embeds from "../utils/embeds";
import { channels } from "../utils/storage";
import guildBoosts from "../utils/games/guildBoost";
import SaveTicketMessages from "./tickets/saveTicketMessages";

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

      const prefix = guildData.prefix;
      if (!prefix || message.content.indexOf(prefix) !== 0) return;
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
            commandObj.permission &&
            !resolvePermissions(message, commandObj.permission)
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

function resolvePermissions(message: Message, permission: string) {
  if (
    permission.toLowerCase().includes("admin") &&
    !message.member.hasPermission("ADMINISTRATOR")
  )
    return false;
  return true;
}
