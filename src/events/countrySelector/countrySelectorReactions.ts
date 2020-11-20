import { stripIndents } from "common-tags";
import { MessageReaction, TextChannel, User } from "discord.js";
import Event from "..";
import { CountryModel } from "../../models/country";
import embeds from "../../utils/embeds";
import react from "../../utils/react";
import { countries, emojis, letterEmojis, roles } from "../../utils/storage";
import _ from "lodash";
import confirmation from "../../utils/confirmation";
import reactionMessage from "../../utils/games/reactionMessage";

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

    if (!countryData.continent && !countryData.continentComplete) {
      if (!continentEmojis.includes(reaction.emoji.name)) return;

      const selectedContinent =
        continents[continentEmojis.indexOf(reaction.emoji.name)];
      const countryFirstLettersEmojis = _.sortedUniq(
        countries[selectedContinent].map(
          (x) => letterEmojis[x[0].charAt(0).toUpperCase()]
        )
      );

      const confirm = await confirmation(
        `Continent Confirmation`,
        `Are you sure you would like to chose **${selectedContinent}** as your continent?`,
        null,
        channel,
        user.id
      );

      if (!confirm) {
        reaction.users.remove(user);
        return;
      }
      if (message.deletable) message.delete();

      const selectCountryLetter = await channel.send(
        embeds.normal(
          `Select the first letter of your country.`,
          `To view all the countries under your continent [click me](https://countries.serverownertycoon.com)!`
        )
      );

      countryData.continent = selectedContinent;
      countryData.continentComplete = true;
      await countryData.save();

      await react(selectCountryLetter, countryFirstLettersEmojis);
    } else if (
      !countryData.countryLetter &&
      !countryData.countryLetterComplete
    ) {
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

      const confirm = await confirmation(
        `Country Letter Confirmation`,
        `Are you sure the first letter of your country is **${letterSelected}**?`,
        null,
        channel,
        user.id
      );

      if (!confirm) {
        reaction.users.remove(user);
        return;
      }
      if (message.deletable) message.delete();

      const countryList = await channel.send(
        embeds.normal(
          `Please select a country from the list below.`,
          stripIndents`${countriesOfLetter
            .map((x) => `${x[2]} ${x[0]}`)
            .join("\n")}`
        )
      );

      countryData.countryLetter = letterSelected;
      countryData.countryLetterComplete = true;
      await countryData.save();

      await react(countryList, countriesEmojis);
    } else if (!countryData.country && !countryData.countryComplete) {
      const continentCountries = countries[countryData.continent];
      const countriesSelected = continentCountries.filter(
        (x) =>
          x[0].charAt(0).toUpperCase() ===
          countryData.countryLetter.toUpperCase()
      );
      const countriesEmojis = countriesSelected.map((x) => x[2]);
      if (!countriesEmojis.includes(reaction.emoji.name)) return;

      const selectedCountry = countriesSelected.find(
        (x) => reaction.emoji.name === x[2]
      )[0];

      const confirm = await confirmation(
        `Country Confirmation`,
        `Are you sure you are from **${selectedCountry}**?`,
        null,
        channel,
        user.id
      );

      if (!confirm) {
        reaction.users.remove(user);
        return;
      }
      if (message.deletable) await message.delete();

      await member.setNickname(
        `${member.user.username.slice(0, 15)} ${reaction.emoji.name}`
      );

      if (!member.roles.cache.has(roles.supporter))
        await member.roles.add(roles.supporter);

      await channel.send(
        embeds.normal(
          `Country Process Complete`,
          `Welcome to the **${channel.guild.name}** discord server **${member.user.username}**!`
        )
      );

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
