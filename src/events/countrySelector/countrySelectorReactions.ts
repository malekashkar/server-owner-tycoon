import { MessageReaction, TextChannel, User } from "discord.js";
import Event from "..";
import { CountryModel } from "../../models/country";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { countries, emojis, letterEmojis, roles } from "../../utils/storage";

export default class CountrySelectorReactions extends Event {
  name = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (user.bot) return;
    if (reaction.message.partial) await reaction.message.fetch();

    const message = reaction.message;
    const channel = message.channel as TextChannel;
    const countryData = await CountryModel.findOne({
      userId: user.id,
      channelId: channel.id,
    });
    if (!countryData) return;

    const member = message.guild.members.resolve(user.id);

    const continents = Object.keys(countries);
    const continentEmojis = emojis.slice(0, continents.length);

    if (!countryData.continent) {
      if (!continentEmojis.includes(reaction.emoji.name)) return;
      const selectedContinent =
        continents[continentEmojis.indexOf(reaction.emoji.name)];
      const continentCountries = countries[selectedContinent];
      const countryFirstLettersEmojis = continentCountries
        .map((x) => x[0].charAt(0).toUpperCase())
        .map((x) => letterEmojis[x]);

      const countryLetterMessage = await channel.send(
        embeds.normal(
          `Select the first letter of your country.`,
          `To view all the countries under your continent [click me](https://countries.serverownertycoon.com)!`
        )
      );
      await react(countryLetterMessage, countryFirstLettersEmojis);

      countryData.continent = selectedContinent;
      await countryData.save();
    } else if (!countryData.countryLetter) {
      const continentCountries = countries[countryData.continent];
      const countryFirstLetters = continentCountries.map((x) =>
        x[0].charAt(0).toUpperCase()
      );
      const countryFirstLettersEmojis = countryFirstLetters.map(
        (x) => letterEmojis[x]
      );
      if (!countryFirstLettersEmojis.includes(reaction.emoji.name)) return;

      const letterSelected =
        countryFirstLetters[
          countryFirstLettersEmojis.indexOf(reaction.emoji.name)
        ];
      const countriesOfLetter = continentCountries.filter(
        (x) => x[0].charAt(0).toUpperCase() === letterSelected.toUpperCase()
      );
      const countriesEmojis = countriesOfLetter.map((x) => x[2]);
      const selectCountryMessage = await channel.send(
        embeds.normal(
          `Please select a country from the list below.`,
          `${countriesOfLetter.map((x) => `${x[2]} ${x[0]}`).join("\n")}`
        )
      );
      await react(selectCountryMessage, countriesEmojis);

      countryData.countryLetter = letterSelected;
      await countryData.save();
    } else if (!countryData.country) {
      const continentCountries = countries[countryData.continent];
      const countriesSelected = continentCountries.filter(
        (x) =>
          x[0].charAt(0).toUpperCase() ===
          countryData.countryLetter.toUpperCase()
      );
      const countriesEmojis = countriesSelected.map((x) => x[2]);
      if (!countriesEmojis.includes(reaction.emoji.name)) return;

      await channel.send(
        embeds.normal(
          `Country Process Complete`,
          `Welcome to the **${channel.guild.name}** discord server **${member.user.username}**!`
        )
      );

      member.setNickname(
        `${member.user.username.slice(0, 15)} ${reaction.emoji.name}`
      );

      if (!member.roles.cache.has(roles.supporter))
        member.roles.add(roles.supporter);

      setTimeout(async () => {
        await countryData.deleteOne();
        channel.delete();
      }, 10 * 1000);
    } else
      setTimeout(async () => {
        channel.delete();
        await countryData.deleteOne();
      }, 10 * 1000);
  }
}
