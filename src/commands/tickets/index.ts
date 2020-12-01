import Command from "..";

export default abstract class TicketCommand extends Command {
  group = "Tickets";
  permissions = ["admin", "human", "mod", "support team"];
}
