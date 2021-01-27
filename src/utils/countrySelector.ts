import { GuildMember, TextChannel } from "discord.js";
import embeds from "../utils/embeds";
import { channels, countries, roles } from "../utils/storage";
import givePoints from "../utils/points";
import stringSimilarity from "string-similarity";
import confirmation from "../utils/confirmation";

export default async function process(
  member: GuildMember,
  points: boolean
): Promise<number> {
  const channel = await member.user.createDM();
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

  if (collector?.size) {
    if (question.deletable) await question.delete();

    const selectedCountry = collector.first().content;
    const countryMatch = stringSimilarity.findBestMatch(
      selectedCountry,
      countriesList
    );
    const countryAbbMatch = stringSimilarity.findBestMatch(
      selectedCountry,
      countriesAbbList
    );
    const country =
      countryMatch.bestMatch.rating >= countryAbbMatch.bestMatch.rating
        ? countryMatch.bestMatch.target
        : countries.find((x) => x[1] === countryAbbMatch.bestMatch.target)[0];

    const confirm = await confirmation(
      `Country Selector Confirmation`,
      `Please confirm the country you are selecting is **${country}**.`,
      collector.first()
    );
    if (confirm) {
      const countryEmoji = countries.find((x) => x[0] === country)[2];
      await member.setNickname(
        `${member.user.username.slice(0, 15)} ${countryEmoji}`
      );

      if (!member.roles.cache.has(roles.supporter))
        await member.roles.add(roles.supporter);

      await channel.send(
        embeds.normal(
          `Verification Complete`,
          `Welcome to the **Server Owner Tycoon** discord **${member.user.username}**!`
        )
      );

      (member.guild.channels.resolve(channels.welcome) as TextChannel).send(
        `**HELLO** there, ${member}!`
      );

      if (points) return await givePoints(member.user, "countrySelector");
      else return 0;
    } else {
      return await process(member, points);
    }
  } else {
    const invite = await member.guild.channels.cache.first().createInvite();
    await channel.send(
      embeds.normal(
        `Verification Failed`,
        `Please [rejoin](${invite.url}) the **Server Owner Tycoon** discord and complete the verification process.`
      )
    );
    await member.kick("Didn't complete country selector.");
    return 0;
  }
}
