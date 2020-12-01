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

  @prop({ default: false })
  continentComplete?: boolean;

  @prop()
  countryLetter?: string;

  @prop({ default: false })
  countryLetterComplete?: boolean;

  @prop()
  country?: string;

  @prop({ default: false })
  countryComplete?: boolean;

  @prop({ default: true })
  entry?: boolean;
}

export const CountryModel = getModelForClass(Country);
