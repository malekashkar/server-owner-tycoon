import Client from "../../structures/client";
import embeds from "../../utils/embeds";
import logger from "../../utils/logger";

import { Message } from "discord.js";
import Guild, { GuildModel } from "../../models/guild";
import { UserModel } from "../../models/user";
import Event from "..";
import { DocumentType } from "@typegoose/typegoose";
import checkPermission from "../../utils/permission";

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

      userData.totalMessages += 1;
      await userData.save();

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
            commandObj.module.toLowerCase() === command.toLowerCase() &&
            commandObj.cmdName.toLowerCase() === args[0].toLowerCase()) ||
          (commandObj.cmdName.toLowerCase() === command &&
            !commandObj.isSubCommand)
        ) {
          if (commandObj.isSubCommand) {
            command = `${commandObj.module} ${args.shift()}`;
          }

          if (
            commandObj.permission &&
            !(await checkPermission(message, commandObj.permission, guildData))
          ) {
            message.channel.send(
              embeds.error(
                guildData,
                `You don't have the **right permissions** to run the command \`${command}\`!`,
                `No Permission`
              )
            );
            return;
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
