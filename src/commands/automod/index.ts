import Command from "..";

export default abstract class AutoModCommand extends Command {
  group = "automod";
  isSubCommand = true;
  permissions = ["admin", "human", "mod"];
}
