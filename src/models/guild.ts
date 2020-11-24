import { getModelForClass, prop } from "@typegoose/typegoose";
import { ModelMapReduceOption } from "mongoose";

class GuessTheNumber {
  @prop()
  lastTime: Date;
}

class ReactionMessage {
  @prop()
  lastTime: Date;
}

class WordUnscrambler {
  @prop()
  lastTime: Date;
}

class Games {
  @prop({ default: {} })
  guessTheNumber?: GuessTheNumber;

  @prop({ default: {} })
  reactionMessage?: ReactionMessage;

  @prop({ default: {} })
  wordUnscrambler?: WordUnscrambler;
}

class Messages {
  @prop()
  reactionRoles?: string;

  @prop()
  ticketPanel?: string;
}

class Moderation {
  @prop()
  enabled: boolean;

  @prop()
  invites: boolean;

  @prop()
  links: boolean;

  @prop()
  selfbot: boolean;

  @prop({ default: 0 })
  mentions: number;

  @prop({ default: 20 })
  mentionsBan: number;

  @prop()
  spamMessageAmount: number;

  @prop()
  spamTime: number;

  @prop()
  mute: boolean;

  @prop({ type: String })
  whitelistedChannelIds: string[];

  @prop()
  muteViolationAmount: number;

  @prop()
  muteViolationInterval: number;
}

export default class DbGuild {
  @prop({ unique: true })
  guildId!: string;

  @prop({ default: "!" })
  prefix?: string;

  @prop()
  joinCategory?: string;

  @prop({ default: {} })
  games?: Games;

  @prop({ default: {} })
  messages?: Messages;

  @prop({ default: true })
  giveaways?: boolean;

  @prop({ default: 1 })
  giveawayPrize?: number;

  @prop()
  moderation?: Moderation;
}

export const GuildModel = getModelForClass(DbGuild, {
  schemaOptions: { collection: "guilds" },
});
