import { Message, Util } from "discord.js";
import UtilityCommand from ".";
import embeds from "../../utils/embeds";

export default class ServerInfoCommand extends UtilityCommand {
  cmdName = "serverinfo";
  description = "Get info on the current server.";

  async run(message: Message) {
    const guild = message.guild;
    return await message.channel.send(
      embeds
        .normal(
          `${guild.name} | Server Information`,
          `Below is some information on this guild.`
        )
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addField(`Guild Name`, guild.name, true)
        .addField(
          `Channel Count`,
          guild.channels.cache.size + ` Channels`,
          true
        )
        .addField(`Member Count`, guild.members.cache.size + ` Members`, true)
        .addField(`Created At`, guild.createdAt.toLocaleDateString(), true)
        .addField(`Owner`, guild.owner.user.tag, true)
        .addField(`Region`, guild.region, true)
        .setFooter(`ID: ${guild.id}`)
        .setTimestamp()
    );
  }
}
