import embeds from "../utils/embeds";
import Command from ".";
import { Message, Collection } from "discord.js";
import Client from "../structures/client";
import User from "../models/user";
import Guild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import { emojis } from "../utils/storage";
import react from "../utils/react";

export interface IGroup {
  commands: string[];
  descriptions: string[];
}

export default class HelpCommand extends Command {
  cmdName = "help";
  description = "Receive the help message with all the information of the bot.";

  async run(
    client: Client,
    message: Message,
    args: string[],
    userData: DocumentType<User>,
    guildData: DocumentType<Guild>
  ) {
    const help: Collection<string, IGroup> = new Collection();

    for (const commandObj of client.commands.array()) {
      if (!commandObj.group) continue;

      const command = commandObj.isSubCommand
        ? commandObj.group + ` ${commandObj.cmdName}`
        : commandObj.cmdName;

      const group = help.get(toTitleCase(commandObj.group));
      if (!group) {
        help.set(toTitleCase(commandObj.group), {
          commands: [command],
          descriptions: [commandObj.description],
        });
      } else {
        group.commands.push(command);
        group.descriptions.push(commandObj.description);
      }
    }

    const groups: string[] = Array.from(help).map(([name, value]) => name);
    const fields = groups.map((name: string, i) => {
      return {
        name: `**${name}** commands`,
        value: `*react with ${emojis[i]} to view*`,
        inline: true,
      };
    });

    const helpEmbed = embeds
      .normal(
        `Help Menu`,
        `Below are all the help groups, click one of the emojis to see the commands.`
      )
      .addFields(fields);

    const emojisForGroups = emojis.slice(0, groups.length);
    const helpMessage = await message.channel.send(helpEmbed);
    await react(helpMessage, emojisForGroups);

    helpMessage
      .awaitReactions(
        (r, u) =>
          u.id === message.author.id && emojisForGroups.includes(r.emoji.name),
        { max: 1, time: 60000, errors: ["time"] }
      )
      .then(async (category) => {
        const categoryName = toTitleCase(
          groups[emojisForGroups.indexOf(category.first().emoji.name)]
        );
        const groupInfo = help.get(categoryName);
        const description = groupInfo.commands
          .map(
            (x, i) =>
              `**${guildData.prefix}${x}** ~ ${groupInfo.descriptions[i]}`
          )
          .join("\n");

        helpMessage.reactions.removeAll();
        helpMessage.edit(
          embeds.normal(categoryName + ` | Commands Info`, description)
        );

        await react(helpMessage, ["◀️"]);
      })
      .catch(async () => await helpMessage.reactions.removeAll());
  }
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
