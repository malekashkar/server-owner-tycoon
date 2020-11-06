import { getModelForClass, prop } from "@typegoose/typegoose";

class GuessTheNumber {
  @prop()
  lastTime: Date;

  @prop()
  number: number;
}

class ReactionMessage {
  @prop()
  lastTime: Date;
}

class WordUnscrambler {
  @prop()
  lastTime: Date;

  @prop()
  word: string;
}

class Games {
  @prop({ default: {} })
  guessTheNumber?: GuessTheNumber;

  @prop({ default: {} })
  reactionMessage?: ReactionMessage;

  @prop({ default: {} })
  wordUnscrambler?: WordUnscrambler;
}

export default class Guild {
  @prop({ unique: true })
  guildId!: string;

  @prop({ default: "!" })
  prefix?: string;

  @prop({ default: {} })
  games?: Games;
}

export const GuildModel = getModelForClass(Guild);
