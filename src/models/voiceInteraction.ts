import { getModelForClass, prop } from "@typegoose/typegoose";

export class VoiceInteraction {
  @prop()
  userId: string;

  @prop()
  joinedTimestamp: number;

  @prop()
  leftTimestamp?: number;

  @prop()
  lastSpeakingTime?: number;

  @prop({ default: 0 })
  speakingTimes?: number;
}

export const VoiceInteractionModel = getModelForClass(VoiceInteraction);
