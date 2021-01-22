import { Message } from "discord.js";
import PointsCommand from ".";
import DbUser, { UserModel } from "../../models/user";
import embeds from "../../utils/embeds";
import Paginator from "../../utils/pagecord";
import _ from "lodash";
import { stripIndents } from "common-tags";
import { DocumentType } from "@typegoose/typegoose";

export default class LeaderboardCommand extends PointsCommand {
  cmdName = "leaderboard";
  description = "Leaderboard for the most amount of points.";

  async run(message: Message) {
    const entries: {
      userId: string;
      points: number;
    }[] = await UserModel.aggregate([
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
                return `${pageIndex * 10 + i + 1}. **${user.username}** ~ \`${
                  x.points
                }\` Points`;
            })
          )
        )
          .filter((x) => !!x)
          .join("\n");

        return embeds.normal(
          `Points Leaderboard`,
          stripIndents`${description}`
        );
      }
    );

    return await paginator.start();
  }
}
