import { getModelForClass, prop } from "@typegoose/typegoose";

export default class Guild {
  @prop({ required: true, unique: true })
  guildId: string;

  @prop({ required: false, default: "!" })
  prefix?: string;
}

export const GuildModel = getModelForClass(Guild);
