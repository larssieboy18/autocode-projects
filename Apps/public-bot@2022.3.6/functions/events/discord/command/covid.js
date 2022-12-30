const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// save the input
var inputcountry = context.params.event.data.options[0].value;

// make API request
try {
  let result = await lib.http.request['@1.1.6'].get({
    url: `https://disease.sh/v3/covid-19/countries/${inputcountry}`,
  });

  // set variables based on result
  let data = result.data;
  var flag = data.countryInfo.flag;
  var country = data.country;
  var cases = data.cases;
  var todaycases = data.todayCases;
  var deaths = data.deaths;
  var todaydeaths = data.todayDeaths;
  var population = data.population;
  var casespermillion = data.casesPerOneMillion;
  var updated = Math.floor(data.updated / 1000);

  // create message with info
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `Here is your requested information about Covid!`,
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Covid-19 stats for ${country}`,
        description: '',
        color: 0x00ff0d,
        fields: [
          {
            name: `Population`,
            value: `${population}`,
            inline: true,
          },
          {
            name: `Total number of infections`,
            value: `${cases}`,
            inline: true,
          },
          {
            name: `People infected today`,
            value: `${todaycases}`,
            inline: true,
          },
          {
            name: `Total deaths`,
            value: `${deaths}`,
            inline: true,
          },
          {
            name: `Number of people infected per million inhabitants`,
            value: `${casespermillion}`,
            inline: true,
          },
          {
            name: `People that died today`,
            value: `${todaydeaths}`,
            inline: true,
          },
          {
            name: `Last updated`,
            value: `<t:${updated}:R>`,
            inline: false,
          },
        ],
        thumbnail: {
          url: `${flag}`,
          height: 0,
          width: 0,
        },
        footer: {
          text: `Source: Worldometers.info & disease.sh`,
        },
      },
    ],
  });
} catch (error) {
  console.error(error);
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Hi <@${context.params.event.member.user.id}>! You tried running \`/covid\`, but unfortunately \`${inputcountry}\` is not a valid country code. Please use a code from this list: <https://l.nadb.xyz/countrycodes>.`,
  });
}
