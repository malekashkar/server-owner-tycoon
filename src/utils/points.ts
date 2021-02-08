import { UserModel } from "../models/user";
import { getRandomIntBetween } from "./storage";
import { User } from "discord.js";

type Games =
  | "joinMilestone"
  | "weekMilestone"
  | "monthMilestone"
  | "yearMilestone"
  | "guessTheNumber"
  | "randomMessageReaction"
  | "reactionMessage"
  | "joinVoiceChannel"
  | "wordUnscramble"
  | "invite"
  | "reactionRoles"
  | "guildBoost"
  | "poll"
  | "qotd"
  | "voiceInteraction"
  | "textInteraction"
  | "countrySelector";

export const gameInfo: {
  [key in Games]: {
    displayName: string;
    minPoints: number;
    maxPoints: number;
    cooldown?: number;
  };
} = {
  joinMilestone: {
    displayName: "Join Milestone",
    minPoints: 10,
    maxPoints: 25,
  },
  weekMilestone: {
    displayName: "Week Milestone",
    minPoints: 50,
    maxPoints: 100,
    cooldown: 7 * 24 * 60 * 60 * 1000,
  },
  monthMilestone: {
    displayName: "Month Milestone",
    minPoints: 200,
    maxPoints: 500,
    cooldown: 30 * 24 * 60 * 60 * 1000,
  },
  yearMilestone: {
    displayName: "Year Milestone",
    minPoints: 1000,
    maxPoints: 2500,
    cooldown: 12 * 30 * 24 * 60 * 60 * 1000,
  },
  guessTheNumber: {
    displayName: "Guess The Number",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 12 * 60 * 60 * 1000,
  },
  randomMessageReaction: {
    displayName: "Random Message Reaction",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 12 * 60 * 60 * 1000,
  },
  reactionMessage: {
    displayName: "Reaction Game",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 12 * 60 * 60 * 1000,
  },
  joinVoiceChannel: {
    displayName: "Voice Channel Join",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 4 * 60 * 60 * 1000,
  },
  wordUnscramble: {
    displayName: "Word Unscramble",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 12 * 60 * 60 * 1000,
  },
  invite: {
    displayName: "Invite",
    minPoints: 20,
    maxPoints: 50,
  },
  reactionRoles: {
    displayName: "Reaction Role",
    minPoints: 10,
    maxPoints: 25,
  },
  guildBoost: {
    displayName: "Guild Boost",
    minPoints: 500,
    maxPoints: 1000,
  },
  poll: {
    displayName: "Poll Reaction",
    minPoints: 10,
    maxPoints: 100,
  },
  qotd: {
    displayName: "QOTD Correct Answer",
    minPoints: 50,
    maxPoints: 200,
  },
  voiceInteraction: {
    displayName: "Voice Interaction",
    minPoints: 50,
    maxPoints: 200,
  },
  textInteraction: {
    displayName: "Text Interaction",
    minPoints: 50,
    maxPoints: 200,
  },
  countrySelector: {
    displayName: "Country Selector",
    minPoints: 50,
    maxPoints: 200,
  },
};

export default async function(user: User, game: Games) {
  const gameInformation = gameInfo[game];
  const points = getRandomIntBetween(
    gameInformation.minPoints,
    gameInformation.maxPoints
  );
  await UserModel.updateOne({ userId: user.id }, { $inc: { points } });
  return points;
}
