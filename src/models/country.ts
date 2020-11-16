import { getModelForClass, prop } from "@typegoose/typegoose";

export default class Country {
  @prop()
  startedAt: Date;

  @prop()
  userId: string;

  @prop()
  channelId: string;

  @prop()
  continent?: string;

  @prop()
  countryLetter?: string;

  @prop()
  country?: string;
}

export const CountryModel = getModelForClass(Country);
