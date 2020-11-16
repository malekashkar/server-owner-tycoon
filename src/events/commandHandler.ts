import logger from "../utils/logger";
import { Message, TextChannel } from "discord.js";
import { GuildModel } from "../models/guild";
import { UserModel } from "../models/user";
import Event from ".";
import GuessTheNumber from "../utils/games/guessTheNumber";
import Milestone from "../utils/games/milestones";
import reactionMessage from "../utils/games/reactionMessage";
import wordUnscramble from "../utils/games/wordUnscramble";

export default class CommandHandler extends Event {
  name = "message";

  async handle(message: Message) {
    if (!message.guild || message.author?.bot) return;
    if (
      !message.member.hasPermission("ADMINISTRATOR") &&
      message?.channel?.id !== this.client.commandsChannel
    )
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

      const pointChannel = this.client.guilds
        .resolve(this.client.mainGuild)
        .channels.resolve(this.client.pointChannel) as TextChannel;

      await GuessTheNumber(message, userData, guildData, pointChannel);
      await Milestone(message, userData, pointChannel);
      await reactionMessage(message, guildData, pointChannel);
      await wordUnscramble(message, userData, guildData, pointChannel);

      const prefix = guildData.prefix;
      if (!prefix || message.content.indexOf(prefix) !== 0) return;
      if (message.deletable) await message.delete();

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
