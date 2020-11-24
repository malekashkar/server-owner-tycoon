import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import DbGuild from "../../models/guild";
import { WarnModel } from "../../models/warn";
import ms from "ms";
import embeds from "../embeds";

export default async function (
  message: Message,
  guildData: DocumentType<DbGuild>
) {
  const docAmount = await WarnModel.countDocuments({
    createdAt: {
      $gte: Date.now() - guildData.moderation.muteViolationInterval,
    },
  });

  if (docAmount >= guildData.moderation.muteViolationAmount) {
    let muteRole = message.guild.roles.cache.find((x) => x.name === "Muted");
    if (!muteRole)
      muteRole = await message.guild.roles.create({
        data: {
          name: "Muted",
        },
      });

    // Mute role permissions

    if (!message.member.roles.cache.has(muteRole.id))
      await message.member.roles.add(muteRole);
    return await message.channel.send(
      embeds.error(
        `You have been **muted** for **${
          guildData.moderation.muteViolationAmount
        }** warnings in under **${ms(
          guildData.moderation.muteViolationInterval
        )}**.`
      )
    );
  }
}
