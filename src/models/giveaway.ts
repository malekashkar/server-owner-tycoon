import { getModelForClass, prop } from "@typegoose/typegoose";

export class Giveaway {
  @prop()
  giveawayMessageId: string;

  @prop()
  prize: number;

  @prop()
  randomNumber: number;

  @prop()
  endsAt: Date;

  @prop({ default: [] })
  winners?: string[];

  @prop({ default: false })
  ended?: boolean;

  @prop({ default: true })
  continueCount?: boolean;
}

export const GiveawayModel = getModelForClass(Giveaway);
