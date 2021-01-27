import { Message } from "discord.js";
import PointsCommand from ".";
import embeds from "../../utils/embeds";
import Paginator from "../../utils/pagecord";
import _ from "lodash";
import { stripIndents } from "common-tags";
import { InviteModel } from "../../models/invite";
export default class InvitesTopCommand extends PointsCommand {
  cmdName = "invitestop";
  description = "Leaderboard for the amount of invites.";

  async run(message: Message) {
    const entries: {
      _id: string;
      count: number;
    }[] = await InviteModel.aggregate([
      {
        $group: {
          _id: "$userId",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    if (!entries.length)
      return message.channel.send(
        embeds.error(`No one has invites currently!`)
      );

    const userChunks = _.chunk(entries, 10);
    const paginator = new Paginator(
      message,
      userChunks.length,
      async (pageIndex) => {
        const description = (
          await Promise.all(
            userChunks[pageIndex].map(async (x, i) => {
              const user = await this.client.users.fetch(x._id);
              if (user)
                return `${pageIndex * 10 + 1 + i}. **${user.username}** ~ \`${
                  x.count
                }\` Invites`;
            })
          )
        )
          .filter((x) => !!x)
          .join("\n");

        return embeds.normal(
          `Invites Leaderboard`,
          stripIndents`${description}`
        );
      }
    );

    return await paginator.start();
  }
}
