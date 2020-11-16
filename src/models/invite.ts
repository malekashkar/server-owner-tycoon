import { getModelForClass, prop } from "@typegoose/typegoose";

export interface IInvite {
  userId: string;
  inviteUserId: string;
}

export default class DbInvite {
  @prop()
  userId: string;

  @prop()
  invitedUserId: string;
}

export const InviteModel = getModelForClass(DbInvite, {
  schemaOptions: { collection: "invites" },
});
