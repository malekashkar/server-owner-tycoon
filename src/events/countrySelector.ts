import { DMChannel, GuildMember, TextChannel } from "discord.js";
import Event from ".";
import embeds from "../utils/embeds";
import { countries, givePoints, roles } from "../utils/storage";
import stringSimilarity from "string-similarity";
import confirmation from "../utils/confirmation";

export default class CountrySelector extends Event {
  name = "guildMemberAdd";

  async handle(member: GuildMember) {
    const dmChannel = await member.user.createDM();
    const country = await questionProcess(dmChannel, member);
    if (country) {
      const countryEmoji = countries.find((x) => x[0] === country)[2];
      await givePoints(member.user, "countrySelector");
      await member.setNickname(
        `${member.user.username.slice(0, 15)} ${countryEmoji}`
      );

      if (!member.roles.cache.has(roles.supporter))
        await member.roles.add(roles.supporter);

      await dmChannel.send(
        embeds.normal(
          `Verification Complete`,
          `Welcome to the **Server Owner Tycoon** discord **${member.user.username}**!`
        )
      );
    } else {
      const invite = await member.guild.channels.cache.first().createInvite();
      await dmChannel.send(
        embeds.normal(
          `Verification Failed`,
          `Please [rejoin](${invite.url}) the **Server Owner Tycoon** discord and complete the verification process.`
        )
      );
      await member.kick("Didn't complete country selector.");
    }
  }
}

async function questionProcess(
  channel: DMChannel | TextChannel,
  member: GuildMember
) {
  const countriesList = countries.map((x) => x[0]);
  const countriesAbbList = countries.map((x) => x[1]);

  const question = await channel.send(
    embeds.question(
      `What country are you joining **Server Owner Tycoon** from?`
    )
  );
  const collector = await channel.awaitMessages(
    (m) => m.author.id === member.id,
    {
      max: 1,
      time: 15 * 60 * 1000,
      errors: ["time"],
    }
  );

  if (collector) {
    if (question.deletable) await question.delete();

    const collectorCountry = collector.first().content;
    const contryMatch = stringSimilarity.findBestMatch(
      collectorCountry,
      countriesList
    );
    const countryAbbMatch = stringSimilarity.findBestMatch(
      collectorCountry,
      countriesAbbList
    );

    if (contryMatch.bestMatch.rating >= countryAbbMatch.bestMatch.rating) {
      return confirmationProcess(channel, member, contryMatch.bestMatch.target);
    } else {
      const country = countries.find(
        (x) => x[1] === countryAbbMatch.bestMatch.target
      )[0];
      return confirmationProcess(channel, member, country);
    }
  } else {
    return false;
  }
}

async function confirmationProcess(
  channel: DMChannel | TextChannel,
  member: GuildMember,
  country: string
) {
  const confirm = await confirmation(
    `Country Selector Confirmation`,
    `Please confirm the country you are selecting is ${country}`,
    null,
    channel,
    member.id
  );
  if (!confirm) questionProcess(channel, member);
  return finalProcess(member, country);
}

async function finalProcess(member: GuildMember, country: string) {
  const countryInfo = countries.find(
    (x) => x[0].toLowerCase() === country.toLowerCase()
  );
  await member.setNickname(member.user.username + ` ${countryInfo[2]}`);
  await member.roles.add(roles.supporter);
}
