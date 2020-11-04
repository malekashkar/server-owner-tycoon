import { Collection, MessageReaction, User } from "discord.js";
import Event from "..";
import Client from "../../structures/client";
import { groupEmojis } from "../../utils/storage";
import { GuildModel } from "../../models/guild";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { IGroup } from "../../commands/help";

export default class HelpCmdBack extends Event {
  name = "messageReactionAdd";

  async handle(client: Client, reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) reaction.message.fetch();

    const message = reaction.message;
    const embed = message.embeds[0];

    const guildData =
      (await GuildModel.findOne({
        guildId: message.guild.id,
      })) ||
      (await GuildModel.create({
        guildId: message.guild.id,
      }));

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

    if (reaction.emoji.name === "◀️") {
      if (
        embed &&
        embed.description &&
        embed.timestamp &&
        embed.title &&
        embed.title.includes(" | Commands Info")
      ) {
        await message.reactions.removeAll();

        const mainHelp = await message.edit(helpEmbed);
        for (const group of groups) {
          await react(mainHelp, [groupEmojis[group.toLowerCase()]]);
        }

        mainHelp
          .awaitReactions(
            (r, u) =>
              u.id === user.id &&
              Object.values(groupEmojis).includes(r.emoji.name),
            { max: 1, time: 60000, errors: ["time"] }
          )
          .then(async (category) => {
            const reactionEmoji = category.first().emoji.name;
            const catNameLowerCase = Object.keys(groupEmojis)[
              Object.values(groupEmojis).indexOf(reactionEmoji)
            ];
            const categoryName = toTitleCase(catNameLowerCase);
            const groupInfo = help.get(categoryName);

            const description = groupInfo.commands
              .map(
                (x, i) =>
                  `**${guildData.prefix}${groupInfo.commands[i]}** ~ ${groupInfo.descriptions[i]}`
              )
              .join("\n");

            await mainHelp.reactions.removeAll();
            await mainHelp.edit(
              embeds.normal(
                guildData,
                categoryName + ` | Commands Info`,
                description
              )
            );

            await react(mainHelp, ["◀️"]);
          })
          .catch(() => message.reactions.removeAll());
      }
    }
  }
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
