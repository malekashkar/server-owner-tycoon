import Client from "../../structures/client";
import logger from "../../utils/logger";
import { Message } from "discord.js";
import { GuildModel } from "../../models/guild";
import { UserModel } from "../../models/user";
import Event from "..";

export default class commandHandler extends Event {
  name = "message";

  async handle(client: Client, message: Message) {
    try {
      if (!message.guild || !message.author || message.author.bot) return;

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

      const prefix = guildData.prefix;
      if (!prefix || message.content.indexOf(prefix) !== 0) return;

      const args = message.content
        .slice(prefix.length)
        .trim()
        .replace(/ /g, "\n")
        .split(/\n+/g);
      let command = args.shift().toLowerCase();

      for (const commandObj of client.commands.array()) {
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

          commandObj
            .run(client, message, args, userData, guildData)
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
