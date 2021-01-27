import { Message } from "discord.js";
import UtilityCommand from ".";
import countrySelector from "../../utils/countrySelector";

export default class CountryCommand extends UtilityCommand {
  cmdName = "country";
  description = "Restart the process to selecting your country.";

  async run(message: Message) {
    await countrySelector(message.member, false);
  }
}
