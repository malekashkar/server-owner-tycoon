import { Client as BaseManager, Collection, Invite } from "discord.js";
import Command from "../commands";

export default class Client extends BaseManager {
  commands: Collection<string, Command> = new Collection();
  invites: Collection<string, Collection<string, Invite>> = new Collection();
}
