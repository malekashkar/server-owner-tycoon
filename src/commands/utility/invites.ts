import { Message } from "discord.js";
import UtilityCommand from ".";
import { InviteModel } from "../../models/invite";
import embeds from "../../utils/embeds";

export default class InvitesCommand extends UtilityCommand {
  cmdName = "invites";
  description = "Check how much invites you have.";
  usage = "[@user]";

  async run(message: Message) {
    const user = message.mentions.users.first() || message.author;
    const invites = await InviteModel.countDocuments({
      userId: user.id,
      fake: false,
    });
    const fakeInvites = await InviteModel.countDocuments({
      userId: user.id,
      fake: true,
    });

    return message.channel.send(
      embeds.normal(
        `${user.username} Invites`,
        `${user} currently has \`${invites}\` invites.${
          fakeInvites ? ` | Fake Invites: **${fakeInvites}**` : ``
        }`
      )
    );
  }
}
