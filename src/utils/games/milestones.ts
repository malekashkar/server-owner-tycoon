import { DocumentType } from "@typegoose/typegoose";
import { Message, TextChannel } from "discord.js";
import Guild from "../../models/guild";
import User from "../../models/user";
import embeds from "../embeds";
import { gameCooldowns, gamePoints } from "../storage";

export default async function Milestone(
  message: Message,
  userData: DocumentType<User>,
  pointChannel: TextChannel
) {
  const timeInDiscord = Date.now() - message.member.joinedTimestamp;

  if (
    timeInDiscord >= gameCooldowns.weekMilestone &&
    !userData.milestones.week
  ) {
    const points = Math.floor(Math.random() * gamePoints.weekMilestone);

    pointChannel.send(
      embeds.normal(
        `Week Milestone`,
        `${message.author} has received **${points}** for their one week milestone in this server!`
      )
    );

    userData.points += points;
    userData.milestones.week = true;
    await userData.save();
  }

  if (
    timeInDiscord >= gameCooldowns.monthMilestone &&
    !userData.milestones.month
  ) {
    const points = Math.floor(Math.random() * gamePoints.monthMilestone);

    pointChannel.send(
      embeds.normal(
        `Month Milestone`,
        `${message.author} has received **${points}** for their one month milestone in this server!`
      )
    );

    userData.points += points;
    userData.milestones.month = true;
    await userData.save();
  }

  if (
    timeInDiscord >= gameCooldowns.yearMilestone &&
    !userData.milestones.year
  ) {
    const points = Math.floor(Math.random() * gamePoints.yearMilestone);

    pointChannel.send(
      embeds.normal(
        `Year Milestone`,
        `${message.author} has received **${points}** for their one year milestone in this server!`
      )
    );

    userData.points += points;
    userData.milestones.year = true;
    await userData.save();
  }
}
