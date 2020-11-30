import { getModelForClass, prop } from "@typegoose/typegoose";

export class QOTD {
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
  correctAnswerIndex: number;

  @prop()
  endsAt: Date;
}

export const QOTDModel = getModelForClass(QOTD);
