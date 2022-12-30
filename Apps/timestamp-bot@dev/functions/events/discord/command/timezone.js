// Be aware that M3O cancelled their free services, so this part will not work unless you pay for a M3O subscription.

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// define the input of the user
let city = context.params.event.data.options[0].value;

// get information about the location that the users inputted
let citydata = await lib.http.request['@1.1.6'].post({
  url: `https://api.m3o.com/v1/time/Zone`,
  authorization: `${process.env.m3oKey}`,
  headers: {
    'Content-Type': `application/json`,
  },
  params: {
    location: `${city}`,
  },
});
console.log(citydata);

// if the location was invalid, return this to the user
if (citydata.data.Code == 500) {
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [
      {
        type: 'rich',
        title: `Invalid input`,
        description: `\`${city}\` is not a valid location. Please try again`,
        color: 0x2b5a1a,
        footer: {
          text: `Powered by Blahaj's magic`,
          icon_url: `https://cdn.discordapp.com/emojis/883052528416198656.gif?size=160&quality=lossless`,
          proxy_icon_url: `https://blahaj.lol`,
        },
      },
    ],
  });
  console.error(`Invalid input. ${city} is not a valid location`);
} else if (citydata.statusCode == 401) {
  // if an invalid api key was provided, let this be known
  console.error(`Invalid API key provided`);
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `An error occured while executing this command. Please ask the owner of the bot to double check its settings.`,
  });
} else {
  // if the location was valid, return information about it to the user
  let info = citydata.data;
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [
      {
        type: 'rich',
        title: `Timezone info for ${info.location} (${info.country})`,
        description: `**UTC-offset:** ${info.offset} \n**Timezone:** ${info.timezone} (${info.abbreviation}) \n**Daylight savings time:** ${info.dst}\n**Current time:** ${info.localtime}`,
        color: 0x2b5a1a,
        footer: {
          text: `Powered by Blahaj's magic`,
          icon_url: `https://cdn.discordapp.com/emojis/883052528416198656.gif?size=160&quality=lossless`,
          proxy_icon_url: `https://blahaj.lol`,
        },
      },
    ],
  });
}
