import { getModelForClass, prop } from "@typegoose/typegoose";

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
}

export const GuildModel = getModelForClass(DbGuild, {
  schemaOptions: { collection: "guilds" },
});
