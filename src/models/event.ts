import { getModelForClass, prop } from "@typegoose/typegoose";

export class Event {
  @prop()
  starterId: string;

  @prop()
  channelId: string;

  @prop()
  eventChannelId: string;

  @prop()
  messageId: string;

  @prop()
  name: string;

  @prop()
  startsAt: Date;
}

export const EventModel = getModelForClass(Event);
