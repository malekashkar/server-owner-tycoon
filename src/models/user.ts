import { getModelForClass, prop } from "@typegoose/typegoose";

class GameCooldowns {
  @prop()
  randomMessageReaction?: Date;

  @prop()
  joinVoiceChannel?: Date;
}

class Milestones {
  @prop({ default: false })
  week?: boolean;

  @prop({ default: false })
  month?: boolean;

  @prop({ default: false })
  year?: boolean;
}

export default class User {
  @prop({ unique: true })
  userId!: string;

  @prop({ default: 0 })
  points?: number;

  @prop({ default: {} })
  gameCooldowns?: GameCooldowns;

  @prop({ default: {} })
  milestones?: Milestones;
}

export const UserModel = getModelForClass(User);
