import { getModelForClass, prop } from "@typegoose/typegoose";

export class Warn {
  @prop()
  userId: string;

  @prop()
  reason: string;

  @prop()
  createdAt: number;
}

export const WarnModel = getModelForClass(Warn);
