import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";

export default class EntryCategoryClass extends AdminCommand {
  cmdName = "entrycategory";
  description = "Set the category where new members select their country.";
  usage = "<category name>";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const categoryName = args.join(" ");
    if (!categoryName)
      return message.channel.send(
        embeds.error(
          `Please provide the name of the category you would like to use!`
        )
      );

    const selectedCategory = message.guild.channels.cache
      .filter((x) => x.type === "category")
      .find((x) => x.name.toLowerCase() === categoryName.toLowerCase());
    if (!selectedCategory)
      return message.channel.send(
        embeds.error(
          `The name \`${categoryName}\` is not a category in this server.`
        )
      );

    guildData.joinCategory = selectedCategory.id;
    await guildData.save();

    return message.channel.send(
      embeds.normal(
        `Category Set`,
        `You have set **${selectedCategory.name}** to be the country selector category!`
      )
    );
  }
}
