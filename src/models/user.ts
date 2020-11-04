import { getModelForClass, prop } from "@typegoose/typegoose";

export default class User {
  @prop({ required: true, unique: true })
  userId: string;
}

export const UserModel = getModelForClass(User);
