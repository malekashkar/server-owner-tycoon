import { Message } from "discord.js";
import UtilityCommand from ".";
import { DMChannel, GuildMember } from "discord.js";
import embeds from "../../utils/embeds";
import { countries, roles } from "../../utils/storage";
import stringSimilarity from "string-similarity";
import confirmation from "../../utils/confirmation";

export default class CountryCommand extends UtilityCommand {
  cmdName = "country";
  description = "Restart the process to selecting your country.";

  async run(message: Message) {
    const dmChannel = await message.author.createDM();
    await questionProcess(dmChannel, message.member);
  }
}

async function questionProcess(channel: DMChannel, member: GuildMember) {
  const countriesList = countries.map((x) => x[0]);
  const countriesAbbList = countries.map((x) => x[1]);

  const question = await channel.send(
    embeds.question(
      `What country are you joining **Server Owner Tycoon** from?`
    )
  );

  const collector = channel.createMessageCollector(
    (m) => m.author.id === member.id,
    {
      max: 1,
      time: 15 * 60 * 1000,
    }
  );

  collector.on("end", async (collected) => {
    if (collected.size) {
      if (question.deletable) await question.delete();

      const selectedCountry = collected.first().content;
      const countryMatch = stringSimilarity.findBestMatch(
        selectedCountry,
        countriesList
      );
      const countryAbbMatch = stringSimilarity.findBestMatch(
        selectedCountry,
        countriesAbbList
      );

      if (countryMatch.bestMatch.rating >= countryAbbMatch.bestMatch.rating) {
        await confirmationProcess(
          channel,
          member,
          countryMatch.bestMatch.target
        );
      } else {
        const country = countries.find(
          (x) => x[1] === countryAbbMatch.bestMatch.target
        )[0];
        await confirmationProcess(channel, member, country);
      }
    }
  });
}

async function confirmationProcess(
  channel: DMChannel,
  member: GuildMember,
  country: string
) {
  const confirm = await confirmation(
    `Country Selector Confirmation`,
    `Please confirm the country you are selecting is **${country}**.`,
    null,
    channel,
    member.id
  );
  if (confirm) {
    await finalProcess(country, member, channel);
  } else {
    await questionProcess(channel, member);
  }
}

async function finalProcess(
  country: string,
  member: GuildMember,
  channel: DMChannel
) {
  const countryEmoji = countries.find((x) => x[0] === country)[2];
  await member.setNickname(
    `${member.user.username.slice(0, 15)} ${countryEmoji}`
  );

  if (!member.roles.cache.has(roles.supporter))
    await member.roles.add(roles.supporter);

  await channel.send(
    embeds.normal(
      `Country Selector Complete`,
      `Welcome back to the **Server Owner Tycoon** discord I guess?!`
    )
  );
}
