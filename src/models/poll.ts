import { getModelForClass, prop } from "@typegoose/typegoose";

export class Poll {
  @prop()
  starterId: string;

  @prop()
  channelId: string;

  @prop()
  messageId: string;

  @prop()
  question: string;

  @prop({ type: String })
  options: string[];

  @prop()
  endsAt: Date;
}

export const PollModel = getModelForClass(Poll);
