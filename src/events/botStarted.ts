import logger from "../utils/logger";
import Event from ".";

export default class botStarted extends Event {
  name = "ready";

  async handle() {
    logger.info(
      `BOT`,
      `The bot "${this.client.user.username}" has started successfully.`
    );

    const guild = this.client.guilds.resolve(this.client.mainGuild);
    if (guild) this.client.invites.set(guild.id, await guild.fetchInvites());
  }
}
