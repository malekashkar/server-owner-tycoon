import Command from "..";

export default abstract class AdminCommand extends Command {
  group = "Administration";
  permission = "ADMIN";
}
