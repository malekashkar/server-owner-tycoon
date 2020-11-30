import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import AutoModCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";

export default class AutoModWhitelistCommand extends AutoModCommand {
  cmdName = "whitelist";
  description = "Whitelist a channel from links posting.";
  usage = "<@channel>";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const channel = message.mentions.channels.first();

    if (!channel) {
      if (!guildData.moderation.whitelistedChannelIds.length)
        return message.channel.send(
          embeds.error(`There are no whitelisted channels currently!`)
        );

      const description = guildData.moderation.whitelistedChannelIds
        .map((x, i) => {
          const channel = message.guild.channels.resolve(x);
          if (channel) return `${i + 1}. ${channel}`;
        })
        .filter((x) => !!x)
        .join("\n");
      return message.channel.send(
        embeds.normal(`Whitelisted Channels`, description)
      );
    } else {
      if (guildData.moderation.whitelistedChannelIds.includes(channel.id)) {
        guildData.moderation.whitelistedChannelIds = guildData.moderation.whitelistedChannelIds.filter(
          (x) => x !== channel.id
        );
        await guildData.save();

        return message.channel.send(
          embeds.normal(
            `Whitelist Removed`,
            `${channel} has been removed from the whitelisted channels.`
          )
        );
      } else {
        guildData.moderation.whitelistedChannelIds.push(channel.id);
        await guildData.save();

        return message.channel.send(
          embeds.normal(
            `Whitelist Added`,
            `${channel} has been whitelisted for all users to post links.`
          )
        );
      }
    }
  }
}
