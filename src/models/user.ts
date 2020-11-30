import { getModelForClass, prop } from "@typegoose/typegoose";

export class ReactionRolesUsed {
  @prop({ default: false })
  announcements?: boolean;

  @prop({ default: false })
  updates?: boolean;

  @prop({ default: false })
  polls?: boolean;

  @prop({ default: false })
  giveaways?: boolean;
}

class GameCooldowns {
  @prop()
  randomMessageReaction?: Date;

  @prop()
  joinVoiceChannel?: Date;

  @prop({ default: {} })
  reactionRoles?: ReactionRolesUsed;
}

class Milestones {
  @prop({ default: false })
  week?: boolean;

  @prop({ default: false })
  month?: boolean;

  @prop({ default: false })
  year?: boolean;
}

export default class DbUser {
  @prop({ unique: true })
  userId!: string;

  @prop({ default: 0 })
  points?: number;

  @prop({ default: {} })
  gameCooldowns?: GameCooldowns;

  @prop({ default: {} })
  milestones?: Milestones;

  @prop({ default: 0 })
  messageSpamMatch?: number;
}

export const UserModel = getModelForClass(DbUser, {
  schemaOptions: { collection: "users" },
});
