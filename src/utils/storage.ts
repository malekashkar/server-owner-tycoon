import { Message, TextChannel, User } from "discord.js";
import { UserModel } from "../models/user";
import embeds from "./embeds";

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

export const letterEmojis: { [x: string]: string } = {
  A: "🇦",
  B: "🇧",
  C: "🇨",
  D: "🇩",
  E: "🇪",
  F: "🇫",
  G: "🇬",
  H: "🇭",
  I: "🇮",
  J: "🇯",
  K: "🇰",
  L: "🇱",
  M: "🇲",
  N: "🇳",
  O: "🇴",
  P: "🇵",
  Q: "🇶",
  R: "🇷",
  S: "🇸",
  T: "🇹",
  U: "🇺",
  V: "🇻",
  W: "🇼",
  X: "🇽",
  Y: "🇾",
  Z: "🇿",
};

export type TicketTypes =
  | "support"
  | "billing"
  | "bug"
  | "suggestion"
  | "involvement"
  | "media";

export const ticketEmojis: { [key in TicketTypes]: string } = {
  support: "❓",
  billing: "💰",
  bug: "🤖",
  suggestion: "💡",
  involvement: "⭐",
  media: "🎵",
};

export const roles = {
  supporter: "565007854483013632",
  giveaways: "691833524117831710",
  announcements: "691827164500197487",
  updates: "691827439306801172",
  polls: "691827338001907762",
  events: "779852796437594152",
};

export const channels = {
  commands: "630102514519506985",
  points: "774513961017802762",
  giveaways: "776245431570399264",
  transcripts: "779798882682929203",
  bugreports: "779798969583927347",
};

export const categories = {
  introduction: "632362434342158337",
  games: "774267515815723018",
  tickets: "779797627377680464",
  inProgressTickets: "779797701889228800",
};

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

export type ReactionRoleNames =
  | "announcements"
  | "updates"
  | "polls"
  | "giveaways";

interface ReactionRoles {
  name: ReactionRoleNames;
  roleId: string;
  description: string;
  reaction: string;
}

export const reactionRoles: ReactionRoles[] = [
  {
    name: "announcements",
    roleId: "691827164500197487",
    description: "Get notified everytime we announce something new.",
    reaction: "📢",
  },
  {
    name: "updates",
    roleId: "691827439306801172",
    description: "Get notified everytime we post a new update.",
    reaction: "📝",
  },
  {
    name: "polls",
    roleId: "691827338001907762",
    description: "Get notified everytime we post a new poll.",
    reaction: "📊",
  },
  {
    name: "giveaways",
    roleId: "691833524117831710",
    description: "Get notified everytime we post a new giveaway.",
    reaction: "💸",
  },
];

export const prizes = {
  PayPal: {
    "$10 PayPal": 50000,
    "$25 PayPal": 125000,
    "$50 PayPal": 250000,
    "$100 PayPal": 500000,
  },
  "Discord Server": {
    "Mention in Announcement": 5000,
    "Add Server Emoji": 10000,
    "Colored Discord Role": 15000,
    "Top of List 24 Hours": 20000,
  },
  "Gift Cards": {
    "$25 Visa": 150000,
    "$25 Microsoft": 150000,
    "$25 Apple": 150000,
    "$25 Steam": 150000,
    "$25 Amazon": 150000,
    "$50 Visa": 300000,
    "$50 Microsoft": 300000,
    "$50 Apple": 300000,
    "$50 Steam": 300000,
    "$50 Amazon": 300000,
  },
  Nitro: {
    "Nitro Classic (1M)": 25000,
    "Discord Nitro (1M)": 50000,
    "Nitro Classic (1Y)": 250000,
    "Discord Nitro (1Y)": 500000,
  },
};

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
  | "guildBoost";

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
    cooldown: 4 * 60 * 60 * 1000,
  },
  randomMessageReaction: {
    displayName: "Random Message Reaction",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 6 * 60 * 60 * 1000,
  },
  reactionMessage: {
    displayName: "Reaction Game",
    minPoints: 10,
    maxPoints: 25,
    cooldown: 2 * 60 * 60 * 1000,
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
    cooldown: 3 * 60 * 60 * 1000,
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
};

export async function givePoints(user: User, game: Games) {
  const gameInformation = gameInfo[game];
  const channel = user.client.channels.resolve(channels.points) as TextChannel;
  const userData =
    (await UserModel.findOne({ userId: user.id })) ||
    (await UserModel.create({ userId: user.id }));
  const points = getRandomIntBetween(
    gameInformation.minPoints,
    gameInformation.maxPoints
  );

  await userData.updateOne({ $inc: { points } });

  return await channel.send(
    embeds.normal(
      `Points Given`,
      `${user} has received **${points}** points from a **${gameInformation.displayName.toLowerCase()}**.`
    )
  );
}

export function getRandomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function msToFormattedTime(num: number) {
  const secs = num / 1000;
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs - hours * 3600) / 60);
  const seconds = secs - hours * 3600 - minutes * 60;
  return hours + ":" + minutes + ":" + seconds;
}

export const countries: { [x: string]: string[][] } = {
  Africa: [
    ["Algeria", "dz", "🇩🇿"],
    ["Angola", "ao", "🇦🇴"],
    ["Benin", "bj", "🇧🇯"],
    ["Botswana", "bw", "🇧🇼"],
    ["Burkina Faso", "bf", "🇧🇫"],
    ["Burundi", "bi", "🇧🇮"],
    ["Cameroon", "cm", "🇨🇲"],
    ["Cape Verde", "cv", "🇨🇻"],
    ["Central African Republic", "cf", "🇨🇫"],
    ["Chad", "td", "🇹🇩"],
    ["Comoros", "km", "🇰🇲"],
    ["Congo", "do", "🇩🇴"],
    ["Côte d'Ivoire", "ci", "🇨🇮"],
    ["Djibouti", "dj", "🇩🇯"],
    ["Egypt", "eg", "🇪🇬"],
    ["Equatorial Guinea", "gq", "🇬🇶"],
    ["Eritrea", "er", "🇪🇷"],
    ["Eswatini", "sz", "🇸🇿"],
    ["Ethiopia", "et", "🇪🇹"],
    ["Gabon", "ga", "🇬🇦"],
    ["Gambia", "gm", "🇬🇲"],
    ["Ghana", "gh", "🇬🇭"],
    ["Guinea", "gn", "🇬🇳"],
    ["Guinea-Bissau", "gw", "🇬🇼"],
    ["Kenya", "ke", "🇰🇪"],
    ["Lesotho", "ls", "🇱🇸"],
    ["Liberia", "lr", "🇱🇷"],
    ["Libya", "ly", "🇱🇾"],
    ["Madagascar", "mg", "🇲🇬"],
    ["Malawi", "mw", "🇲🇼"],
    ["Mali", "ml", "🇲🇱"],
    ["Mauritania", "mr", "🇲🇷"],
    ["Mauritius", "mu", "🇲🇺"],
    ["Mayotte", "yt", "🇾🇹"],
    ["Morocco", "ma", "🇲🇦"],
    ["Mozambique", "mz", "🇲🇿"],
    ["Namibia", "na", "🇳🇦"],
    ["Niger", "ne", "🇳🇪"],
    ["Nigeria", "ng", "🇳🇬"],
    ["Réunion", "re", "🇷🇪"],
    ["Rwanda", "rw", "🇷🇼"],
    ["Saint Helena", "sh", "🇸🇭"],
    ["São Tomé and Príncipe", "st", "🇸🇹"],
    ["Senegal", "sn", "🇸🇳"],
    ["Seychelles", "sc", "🇸🇨"],
    ["Sierra Leone", "sl", "🇸🇱"],
    ["Somalia", "so", "🇸🇴"],
    ["South Africa", "za", "🇿🇦"],
    ["South Sudan", "ss", "🇸🇸"],
    ["Sudan", "sd", "🇸🇩"],
    ["Tanzania", "tz", "🇹🇿"],
    ["Togo", "tg", "🇹🇬"],
    ["Tunisia", "tn", "🇹🇳"],
    ["Uganda", "ug", "🇺🇬"],
    ["Western Sahara", "eh", ""],
    ["Zambia", "zm", "🇿🇲"],
    ["Zimbabwe", "zw", "🇿🇼"],
  ],
  Asia: [
    ["Afghanistan", "af", "🇦🇫"],
    ["Armenia", "am", "🇦🇲"],
    ["Azerbaijan", "az", "🇦🇿"],
    ["Bahrain", "bh", "🇧🇭"],
    ["Bangladesh", "bd", "🇧🇩"],
    ["Bhutan", "bt", "🇧🇹"],
    ["Brunei", "bn", "🇧🇳"],
    ["Cambodia", "kh", "🇰🇭"],
    ["China", "cn", "🇨🇳"],
    ["Egypt", "eg", "🇪🇬"],
    ["Georgia", "ge", "🇬🇪"],
    ["Hong Kong", "hk", "🇭🇰"],
    ["India", "in", "🇮🇳"],
    ["Indonesia", "id", "🇮🇩"],
    ["Iran", "ir", "🇮🇷"],
    ["Iraq", "iq", "🇮🇶"],
    ["Israel", "il", "🇮🇱"],
    ["Japan", "jp", "🇯🇵"],
    ["Jordan", "jo", "🇯🇴"],
    ["Kazakhstan", "kz", "🇰🇿"],
    ["Kuwait", "kw", "🇰🇼"],
    ["Laos", "la", "🇱🇦"],
    ["Lebanon", "lb", "🇱🇧"],
    ["Macao Sar China", "mo", "🇲🇴"],
    ["Malaysia", "my", "🇲🇾"],
    ["Maldives", "mv", "🇲🇻"],
    ["Mongolia", "mn", "🇲🇳"],
    ["Myanmar", "mm", "🇲🇲"],
    ["Nepal", "np", "🇳🇵"],
    ["North Korea", "kp", "🇰🇵"],
    ["Oman", "om", "🇴🇲"],
    ["Pakistan", "pk", "🇵🇰"],
    ["Palestine", "ps", "🇵🇸"],
    ["Philippines", "ph", "🇵🇭"],
    ["Qatar", "qa", "🇶🇦"],
    ["Russia", "ru", "🇷🇺"],
    ["Saudi Arabia", "sa", "🇸🇦"],
    ["Singapore", "sg", "🇸🇬"],
    ["South Korea", "kr", "🇰🇷"],
    ["Sri Lanka", "lk", "🇱🇰"],
    ["Syria", "sy", "🇸🇾"],
    ["Taiwan", "tw", "🇹🇼"],
    ["Tajikistan", "tj", "🇹🇯"],
    ["Thailand", "th", "🇹🇭"],
    ["Timor-Leste", "tl", "🇹🇱"],
    ["Turkey", "tr", "🇹🇷"],
    ["Turkmenistan", "tm", "🇹🇲"],
    ["United Arab Emirates", "ae", "🇦🇪"],
    ["Uzbekistan", "uz", "🇺🇿"],
    ["Vietnam", "vn", "🇻🇳"],
    ["Yemen", "ye", "🇾🇪"],
  ],
  Europe: [
    ["Åland Islands", "ax", "🇦🇽"],
    ["Albania", "al", "🇦🇱"],
    ["Andorra", "ad", "🇦🇩"],
    ["Austria", "at", "🇦🇹"],
    ["Belarus", "by", "🇧🇾"],
    ["Belgium", "be", "🇧🇪"],
    ["Bosnia and Herzegovina", "ba", "🇧🇦"],
    ["Bulgaria", "bg", "🇧🇬"],
    ["Croatia", "hr", "🇭🇷"],
    ["Cyprus", "cy", "🇨🇾"],
    ["Czechia", "cz", "🇨🇿"],
    ["Denmark", "dk", "🇩🇰"],
    ["Estonia", "ee", "🇪🇪"],
    ["Faroe Islands", "fo", "🇫🇴"],
    ["Finland", "fi", "🇫🇮"],
    ["France", "fr", "🇫🇷"],
    ["Germany", "de", "🇩🇪"],
    ["Gibraltar", "gi", "🇬🇮"],
    ["Greece", "gr", "🇬🇷"],
    ["Guernsey", "gg", "🇬🇬"],
    ["Hungary", "hu", "🇭🇺"],
    ["Iceland", "is", "🇮🇸"],
    ["Ireland", "ie", "🇮🇪"],
    ["Isle of man", "im", "🇮🇲"],
    ["Italy", "it", "🇮🇹"],
    ["Jersey", "je", "🇯🇪"],
    ["Kosovo", "xk", "🇽🇰"],
    ["Latvia", "lv", "🇱🇻"],
    ["Liechtenstein", "li", "🇱🇮"],
    ["Lithuania", "lt", "🇱🇹"],
    ["Luxembourg", "lu", "🇱🇺"],
    ["Malta", "mt", "🇲🇹"],
    ["Moldova", "md", "🇲🇩"],
    ["Monaco", "mc", "🇲🇨"],
    ["Montenegro", "me", "🇲🇪"],
    ["Netherlands", "nl", "🇳🇱"],
    ["North Macedonia", "mk", "🇲🇰"],
    ["Norway", "no", "🇳🇴"],
    ["Poland", "pl", "🇵🇱"],
    ["Portugal", "pt", "🇵🇹"],
    ["Romania", "ro", "🇷🇴"],
    ["Russia", "ru", "🇷🇺"],
    ["San Marino", "sm", "🇸🇲"],
    ["Serbia", "rs", "🇷🇸"],
    ["Slovakia", "sk", "🇸🇰"],
    ["Slovenia", "si", "🇸🇮"],
    ["Spain", "es", "🇪🇸"],
    ["Svalbard and Jan Mayen", "sj", "🇸🇯"],
    ["Sweden", "se", "🇸🇪"],
    ["Switzerland", "ch", "🇨🇭"],
    ["Turkey", "tr", "🇹🇷"],
    ["Ukraine", "ua", "🇺🇦"],
    ["United Kingdom", "gb", "🇬🇧"],
    ["Vatican City", "va", "🇻🇦"],
  ],
  "North America": [
    ["Anguilla", "ai", "🇦🇮"],
    ["Antigua and Barbuda", "ag", "🇦🇬"],
    ["Aruba", "aw", "🇦🇼"],
    ["Bahamas", "bs", "🇧🇸"],
    ["Barbados", "bb", "🇧🇧"],
    ["Belize", "bz", "🇧🇿"],
    ["Bermuda", "bm", "🇧🇲"],
    ["British Virgin Islands", "vg", "🇻🇬"],
    ["Canada", "ca", "🇨🇦"],
    ["Caribbean Netherlands", "bq", "🇧🇶"],
    ["Cayman Islands", "ky", "🇰🇾"],
    ["Costa Rica", "cr", "🇨🇷"],
    ["Cuba", "cu", "🇨🇺"],
    ["Curaçao", "cw", "🇨🇼"],
    ["Dominica", "dm", "🇩🇲"],
    ["Dominican Republic", "do", "🇩🇴"],
    ["El Salvador", "sv", "🇸🇻"],
    ["Greenland", "gl", "🇬🇱"],
    ["Grenada", "gd", "🇬🇩"],
    ["Guadeloupe", "gp", "🇬🇵"],
    ["Guatemala", "gt", "🇬🇹"],
    ["Haiti", "ht", "🇭🇹"],
    ["Honduras", "hn", "🇭🇳"],
    ["Jamaica", "jm", "🇯🇲"],
    ["Martinique", "mq", "🇲🇶"],
    ["Mexico", "mx", "🇲🇽"],
    ["Montserrat", "ms", "🇲🇸"],
    ["Nicaragua", "ni", "🇳🇮"],
    ["Panama", "pa", "🇵🇦"],
    ["Puerto Rico", "pr", "🇵🇷"],
    ["Saint Barthélemy", "bl", "🇧🇱"],
    ["Saint Kitts and Nevis", "kn", "🇰🇳"],
    ["Saint Lucia", "lc", "🇱🇨"],
    ["Saint Martin", "mf", "🇲🇫"],
    ["Saint Pierre and Miquelon", "pm", "🇵🇲"],
    ["Saint Vincent and the Grenadine", "svc", "🇻🇨"],
    ["St. Martin", "mf", "🇲🇫"],
    ["Turks and Caicos Islands", "tc", "🇹🇨"],
    ["United States", "us", "🇺🇸"],
    ["U.S. Outlying Islands", "um", "🇺🇲"],
    ["U.S. Virgin Islands", "vi", "🇻🇮"],
  ],
  Oceania: [
    ["American Samoa", "as", "🇦🇸"],
    ["Australia", "au", "🇦🇺"],
    ["Christmas Island", "cx", "🇨🇽"],
    ["Cocos Islands", "cc", "🇨🇨"],
    ["Cook Islands", "ck", "🇨🇰"],
    ["Fiji", "fj", "🇫🇯"],
    ["French Polynesia", "pf", "🇲🇭"],
    ["Guam", "gu", ""],
    ["Indonesia", "id", ""],
    ["Kiribati", "ki", ""],
    ["Marshall Islands", "mh", ""],
    ["Micronesia", "fm", "🇫🇲"],
    ["Nauru", "nr", "🇳🇷"],
    ["New Caledonia", "nc", "🇳🇨"],
    ["New Zealand", "nz", "🇳🇿"],
    ["Niue", "nu", "🇳🇺"],
    ["Norfolk Island", "nf", "🇳🇫"],
    ["Northern Mariana Islands", "mp", "🇲🇵"],
    ["Palau", "pw", "🇵🇼"],
    ["Papua New Guinea", "pn", "🇵🇬"],
    ["Pitcairn Islands", "pn", "🇵🇳"],
    ["Samoa", "ws", "🇼🇸"],
    ["Solomon Islands", "sb", "🇸🇧"],
    ["Tokelau", "tk", "🇹🇰"],
    ["Tonga", "to", "🇹🇴"],
    ["Tuvalu", "tv", "🇹🇻"],
    ["Vanuatu", "vu", "🇻🇺"],
    ["Wallis and Futuna", "wf", "🇼🇫"],
  ],
  "South America": [
    ["Argentina", "ar", "🇦🇷"],
    ["Bolivia", "bo", "🇧🇴"],
    ["Brazil", "br", "🇧🇷"],
    ["Chile", "cl", "🇨🇱"],
    ["Colombia", "co", "🇨🇴"],
    ["Ecuador", "ec", "🇪🇨"],
    ["Falkland Islands", "fk", "🇫🇰"],
    ["French Guiana", "gf", "🇬🇫"],
    ["Guyana", "gy", "🇬🇾"],
    ["Paraguay", "py", "🇵🇾"],
    ["Peru", "pe", "🇵🇪"],
    ["Suriname", "sr", "🇸🇷"],
    ["Trinidad and Tobago", "tt", "🇹🇹"],
    ["Uruguay", "uy", "🇺🇾"],
    ["Venezuela", "ve", "🇻🇪"],
  ],
};
