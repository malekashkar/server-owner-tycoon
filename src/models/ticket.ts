import { getModelForClass, prop } from "@typegoose/typegoose";

class Message {
  @prop()
  userTag: string;

  @prop()
  sentAt: Date;

  @prop()
  content: string;
}

export class Ticket {
  @prop()
  userId: string;

  @prop()
  channelId: string;

  @prop({ default: false })
  inProgress?: boolean;

  @prop({ default: false })
  closed?: boolean;

  @prop()
  closedById?: string;

  @prop({ type: Message })
  messages?: Message[];
}

export const TicketModel = getModelForClass(Ticket);
