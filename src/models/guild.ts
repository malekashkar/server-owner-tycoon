import { getModelForClass, prop } from "@typegoose/typegoose";

const defaultLeaveMessage = `Farewell (user), it's been nice having you here...`;
const defaultJoinMessage = `Welcome (user) to the server. (inviter) now has (invites) invites.`;
const defaultTicketMessage = `Thank you for opening a ticket support will be right with you.\nPlease wait patiently as they may be busy with others right now!`;
const defaultFooterWatermark = `Create your own bot with buildbots.net!`;
const defaultMutedRole = "Muted";

class Roles {
  @prop({ required: false, default: defaultMutedRole })
  mute: string;
}

class TicketTypes {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  panelChannelId: string;

  @prop({ required: true, unique: true })
  panelMessageId: string;

  @prop({ required: false })
  categoryId?: string;

  @prop({ required: true, default: defaultTicketMessage })
  joinMsg?: string;

  @prop({ required: false })
  claimChannelId?: string;
}

class InvitesLeave {
  @prop({ required: true })
  channel: string;

  @prop({ required: true, default: defaultLeaveMessage })
  message: string;
}

class InvitesRoles {
  @prop({ required: true, unique: true })
  role: string;

  @prop({ required: true })
  invites: number;
}

class InvitesJoin {
  @prop({ required: true })
  channel: string;

  @prop({ required: true, default: defaultJoinMessage })
  message: string;
}

class Invites {
  @prop({ required: false })
  join?: InvitesJoin;

  @prop({ required: false })
  leave?: InvitesLeave;

  @prop({ required: false, type: InvitesRoles })
  roles?: InvitesRoles[];
}

class Giveaways {
  @prop({ required: false, type: String })
  bypassRoles?: string[];

  @prop({ required: false, type: String })
  adminUsers?: string[];
}

class createOrder {
  @prop({ required: true })
  categoryId: string;

  @prop({ required: true })
  messageId: string;
}

export default class Guild {
  @prop({ required: true, unique: true })
  guildId: string;

  @prop({ required: false, default: "!" })
  prefix?: string;

  @prop({ required: false, default: defaultFooterWatermark })
  watermark?: string;

  @prop({ required: false })
  roles?: Roles;

  @prop({ required: false, type: TicketTypes, default: [] })
  ticketTypes?: TicketTypes[];

  @prop({ required: false })
  invites?: Invites;

  @prop({ required: false })
  giveaways?: Giveaways;

  @prop({ required: false })
  order?: createOrder;
}

export const GuildModel = getModelForClass(Guild);
