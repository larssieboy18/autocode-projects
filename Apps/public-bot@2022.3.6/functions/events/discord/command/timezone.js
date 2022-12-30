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
let info = citydata.data;

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
      },
    ],
  });
  console.error(`Invalid input. ${city} is not a valid location`);
  // if the location was valid, return information about it to the user
} else if (citydata.statusCode == 200) {
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
      },
    ],
  });
} else {
  await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `An unknown error occured, please try again. If this keeps happening, please report it in the NADB support server.`,
  });
  console.error(citydata);
}
