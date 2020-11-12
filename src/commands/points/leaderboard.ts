import { Message } from "discord.js";
import PointsCommand from ".";
import { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";
import Paginator from "../../utils/pagecord";
import _ from "lodash";

export default class LeaderboardCommand extends PointsCommand {
  cmdName = "leaderboard";
  description = "Leaderboard for the most amount of points.";

  async run(message: Message) {
    const entries = await UserModel.aggregate([
      {
        $match: {
          points: { $gte: 1 },
        },
      },
      {
        $sort: {
          points: -1,
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
              const user = await this.client.users.fetch(x.userId);
              if (user)
                return `${i + 1}. **${user.username}** ~ \`${
                  x.points
                }\` Points`;
            })
          )
        )
          .filter((x) => !!x)
          .join("\n");

        return embeds.normal(`Points Leaderboard`, description);
      }
    );

    return await paginator.start();
  }
}
