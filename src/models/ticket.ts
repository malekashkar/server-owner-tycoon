import { getModelForClass, prop } from "@typegoose/typegoose";

export class DbMessage {
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

  @prop({ type: DbMessage })
  messages?: DbMessage[];
}

export const TicketModel = getModelForClass(Ticket);
