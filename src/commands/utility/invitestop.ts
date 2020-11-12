import { Message } from "discord.js";
import PointsCommand from ".";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";
import Paginator from "../../utils/pagecord";
import _ from "lodash";

export default class InvitesTopCommand extends PointsCommand {
  cmdName = "invitestop";
  description = "Leaderboard for the amount of invites.";

  async run(message: Message) {
    const entries = await UserModel.aggregate([
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
      return message.channel.send(embeds.error(`No one has points currently!`));

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
                return `${i + 1}. **${user.username}** ~ \`${
                  x.count
                }\` Invites`;
            })
          )
        )
          .filter((x) => !!x)
          .join("\n");

        return embeds.normal(`Invites Leaderboard`, description);
      }
    );

    return await paginator.start();
  }
}
