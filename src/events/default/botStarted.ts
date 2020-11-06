import Client from "../../structures/client";
import logger from "../../utils/logger";
import Event from "..";
export default class botStarted extends Event {
  name = "ready";

  async handle(client: Client) {
    logger.info(
      `BOT`,
      `The bot "${client.user.username}" has started successfully.`
    );

    for (let i = 0; i < client.guilds.cache.size; i++) {
      const guild = client.guilds.cache.array()[i];
      client.invites.set(guild.id, await guild.fetchInvites());
    }
  }
}
