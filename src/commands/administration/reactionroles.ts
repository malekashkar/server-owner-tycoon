import { DocumentType } from "@typegoose/typegoose";
import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import AdminCommand from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { reactionRoles } from "../../utils/storage";

export default class ReactionRolesCommand extends AdminCommand {
  cmdName = "reactionroles";
  description = "Send the reaction roles message";
  permission = "administrator";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const reactionMessage = await message.channel.send(
      embeds.normal(
        `Reaction Roles`,
        stripIndents`${reactionRoles
          .map((x) => `${x.reaction} <@&${x.roleId}> ~ ${x.description}`)
          .join("\n")}`
      )
    );
    await react(
      reactionMessage,
      reactionRoles.map((x) => x.reaction)
    );

    guildData.messages.reactionRoles = reactionMessage.id;
    await guildData.save();
  }
}
