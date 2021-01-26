import { DMChannel, GuildMember, TextChannel } from "discord.js";
import Event from ".";
import embeds from "../utils/embeds";
import { channels, countries, roles } from "../utils/storage";
import givePoints from "../utils/points";
import stringSimilarity from "string-similarity";
import confirmation from "../utils/confirmation";

export default class CountrySelector extends Event {
  name = "guildMemberAdd";

  async handle(member: GuildMember) {
    const dmChannel = await member.user.createDM();
    await questionProcess(dmChannel, member);
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
    } else {
      await failedProcess(member, channel);
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

async function failedProcess(member: GuildMember, channel: DMChannel) {
  const invite = await member.guild.channels.cache.first().createInvite();
  await channel.send(
    embeds.normal(
      `Verification Failed`,
      `Please [rejoin](${invite.url}) the **Server Owner Tycoon** discord and complete the verification process.`
    )
  );
  await member.kick("Didn't complete country selector.");
}

async function finalProcess(
  country: string,
  member: GuildMember,
  channel: DMChannel
) {
  const countryEmoji = countries.find((x) => x[0] === country)[2];
  await givePoints(member.user, "countrySelector");
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

  const welcomeChannel = member.guild.channels.resolve(
    channels.welcome
  ) as TextChannel;
  welcomeChannel.send(`**HELLO** there, ${member}!`);
}
