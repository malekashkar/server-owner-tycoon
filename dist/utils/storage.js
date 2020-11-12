"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countries = exports.categories = exports.gamePoints = exports.gameCooldowns = exports.reactionRoles = exports.badWords = exports.emojis = exports.linkParts = void 0;
exports.linkParts = ["https://", "http://", "discord.gg/"];
exports.emojis = [
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
exports.badWords = [
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
exports.reactionRoles = [
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
exports.gameCooldowns = {
    guessTheNumber: 4 * 60 * 60 * 1000,
    randomMessageReaction: 6 * 60 * 60 * 1000,
    reactionMessage: 2 * 60 * 60 * 1000,
    joinVoiceChannel: 4 * 60 * 60 * 1000,
    weekMilestone: 7 * 24 * 60 * 60 * 1000,
    monthMilestone: 30 * 24 * 60 * 60 * 1000,
    yearMilestone: 12 * 30 * 24 * 60 * 60 * 1000,
    wordUnscramble: 3 * 60 * 60 * 1000,
};
exports.gamePoints = {
    joinMilestone: 20,
    weekMilestone: 50,
    monthMilestone: 200,
    yearMilestone: 1000,
    guessTheNumber: 50,
    randomMessageReaction: 20,
    reactionMessage: 30,
    joinVoiceChannel: 10,
    wordUnscramble: 25,
    invite: 5,
    reactionRoles: 50,
    guildBoost: 100,
};
exports.categories = {
    introduction: "632362434342158337",
    games: "774267515815723018",
};
exports.countries = {
    Africa: [
        "dz",
        "ao",
        "bj",
        "bw",
        "bf",
        "bi",
        "cm",
        "cv",
        "cf",
        "td",
        "km",
        "do",
        "ci",
        "dj",
        "eg",
        "gq",
        "er",
        "sz",
        "et",
        "ga",
        "gm",
        "gh",
        "gn",
        "gw",
        "ke",
        "ls",
        "lr",
        "ly",
        "mg",
        "mw",
        "ml",
        "mr",
        "mu",
        "yt",
        "ma",
        "mz",
        "na",
        "ne",
        "ng",
        "re",
        "rw",
        "sh",
        "st",
        "sn",
        "sc",
        "sl",
        "so",
        "za",
        "ss",
        "sd",
        "tz",
        "tg",
        "tn",
        "ug",
        "eh",
        "zm",
        "zw",
    ],
    Asia: [
        "af",
        "am",
        "az",
        "bh",
        "bd",
        "bt",
        "bn",
        "kh",
        "cn",
        "eg",
        "ge",
        "hk",
        "in",
        "id",
        "ir",
        "iq",
        "il",
        "jp",
        "jo",
        "kz",
        "kp",
        "kr",
        "kw",
        "la",
        "lb",
        "mo",
        "my",
        "mv",
        "mn",
        "mm",
        "np",
        "om",
        "pk",
        "ps",
        "ph",
        "qa",
        "ru",
        "sa",
        "sg",
        "lk",
        "sy",
        "tw",
        "tj",
        "th",
        "tl",
        "tr",
        "tm",
        "ae",
        "uz",
        "vn",
        "ye",
    ],
    Europe: [
        "ax",
        "al",
        "ad",
        "at",
        "by",
        "be",
        "ba",
        "bg",
        "hr",
        "cy",
        "cz",
        "dk",
        "ee",
        "fo",
        "fi",
        "fr",
        "de",
        "gi",
        "gr",
        "gg",
        "hu",
        "is",
        "Ie",
        "Im",
        "it",
        "je",
        "xk",
        "lv",
        "li",
        "lt",
        "lu",
        "mt",
        "md",
        "mc",
        "me",
        "nl",
        "mk",
        "no",
        "pl",
        "pt",
        "ro",
        "ru",
        "sm",
        "rs",
        "sk",
        "si",
        "es",
        "sj",
        "se",
        "ch",
        "tr",
        "ua",
        "gb",
        "va",
    ],
    "North America": [
        "ai",
        "ag",
        "aw",
        "bs",
        "bb",
        "bz",
        "bm",
        "ca",
        "bq",
        "ky",
        "cr",
        "cu",
        "cw",
        "dm",
        "do",
        "sv",
        "gl",
        "gd",
        "gp",
        "gt",
        "ht",
        "hn",
        "jm",
        "mq",
        "mx",
        "ms",
        "ni",
        "pa",
        "pr",
        "bl",
        "kn",
        "lc",
        "mf",
        "pm",
        "vc",
        "mf",
        "tc",
        "us",
        "um",
        "vg",
        "vi",
    ],
    Oceania: [
        "as",
        "au",
        "cx",
        "cc",
        "ck",
        "fj",
        "pf",
        "gu",
        "id",
        "ki",
        "mh",
        "fm",
        "nr",
        "nc",
        "nz",
        "nu",
        "nf",
        "mp",
        "pw",
        "pn",
        "pn",
        "ws",
        "sb",
        "tk",
        "to",
        "tv",
        "vu",
        "wf",
    ],
    "South America": [
        "ar",
        "bo",
        "br",
        "cl",
        "co",
        "ec",
        "fk",
        "gf",
        "gy",
        "py",
        "pe",
        "sr",
        "tt",
        "uy",
        "ve",
    ],
};
