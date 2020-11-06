import ms from "ms";

export const linkParts: string[] = ["https://", "http://", "discord.gg/"];

export const emojis: string[] = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇶",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿",
];

export const badWords: string[] = [
  "fuck",
  "cunt",
  "bastard",
  "nigga",
  "nigger",
  "paki",
  "shit",
  "shite",
  "kys",
  "dick",
];

export const gameCooldowns = {
  guessTheNumber: 4 * 60 * 60 * 1000,
  randomMessageReaction: 6 * 60 * 60 * 1000,
  reactionMessage: 2 * 60 * 60 * 1000,
  joinVoiceChannel: 4 * 60 * 60 * 1000,
  weekMilestone: 7 * 24 * 60 * 60 * 1000,
  monthMilestone: 30 * 24 * 60 * 60 * 1000,
  yearMilestone: 12 * 30 * 24 * 60 * 60 * 1000,
  wordUnscramble: 3 * 60 * 60 * 1000,
};

export const gamePoints = {
  guessTheNumber: 50,
  randomMessageReaction: 20,
  reactionMessage: 30,
  joinVoiceChannel: 10,
  weekMilestone: 50,
  monthMilestone: 150,
  yearMilestone: 1000,
  wordUnscramble: 25,
  invite: 5,
};
