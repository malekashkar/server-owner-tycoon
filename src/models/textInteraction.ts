import { getModelForClass, prop } from "@typegoose/typegoose";

export class TextInteraction {
  @prop()
  userId: string;

  @prop()
  lastSpeakingTime?: number;

  @prop()
  speakingTimes: number;
}

export const TextInteractionModel = getModelForClass(TextInteraction);
