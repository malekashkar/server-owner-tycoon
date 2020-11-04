import embeds from "../utils/embeds";
import Command from ".";
import { Message, Collection } from "discord.js";
import Client from "../structures/client";
import User from "../models/user";
import Guild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";
import { groupEmojis } from "../utils/storage";
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
    const fields = groups.map((name: string) => {
      return {
        name: `**${name}** commands`,
        value: `*react with ${groupEmojis[name.toLowerCase()]} to view*`,
        inline: true,
      };
    });

    const helpEmbed = embeds
      .normal(
        guildData,
        `Help Menu`,
        `Below are all the help groups, click one of the emojis to see the commands.`
      )
      .addFields(fields);

    const helpMessage = await message.channel.send(helpEmbed);

    for (const group of groups) {
      await react(helpMessage, [groupEmojis[group.toLowerCase()]]);
    }

    helpMessage
      .awaitReactions(
        (r, u) =>
          u.id === message.author.id &&
          Object.values(groupEmojis).includes(r.emoji.name),
        { max: 1, time: 60000, errors: ["time"] }
      )
      .then(async (category) => {
        const categoryName = toTitleCase(
          Object.keys(groupEmojis)[
            Object.values(groupEmojis).indexOf(category.first().emoji.name)
          ]
        );
        const groupInfo = help.get(categoryName);

        const description = groupInfo.commands
          .map(
            (x, i) =>
              `**${guildData.prefix}${groupInfo.commands[i]}** ~ ${groupInfo.descriptions[i]}`
          )
          .join("\n");

        helpMessage.reactions.removeAll();
        helpMessage.edit(
          embeds.normal(
            guildData,
            categoryName + ` | Commands Info`,
            description
          )
        );

        await react(helpMessage, ["◀️"]);
      })
      .catch(async () => await helpMessage.reactions.removeAll());
  }
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
