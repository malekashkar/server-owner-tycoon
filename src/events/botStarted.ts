import logger from "../utils/logger";
import Event from ".";

export default class botStarted extends Event {
  name = "ready";

  async handle() {
    logger.info(
      `BOT`,
      `The bot "${this.client.user.username}" has started successfully.`
    );

    this.client.invites.set(
      this.client.guild.id,
      await this.client.guild.fetchInvites()
    );
  }
}
