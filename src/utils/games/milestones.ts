import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import User from "../../models/user";
import givePoints, { gameInfo } from "../points";

export default async function Milestone(
  message: Message,
  userData: DocumentType<User>
) {
  const timeInDiscord = Date.now() - message.member.joinedTimestamp;

  if (
    timeInDiscord >= gameInfo.weekMilestone.cooldown &&
    !userData.milestones.week
  ) {
    await givePoints(message.author, "weekMilestone");
    userData.milestones.week = true;
    await userData.save();
  }

  if (
    timeInDiscord >= gameInfo.monthMilestone.cooldown &&
    !userData.milestones.month
  ) {
    await givePoints(message.author, "monthMilestone");
    userData.milestones.month = true;
    await userData.save();
  }

  if (
    timeInDiscord >= gameInfo.yearMilestone.cooldown &&
    !userData.milestones.year
  ) {
    await givePoints(message.author, "yearMilestone");
    userData.milestones.year = true;
    await userData.save();
  }
}
