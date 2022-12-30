// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// sets variables
let {guild_id, data, token} = context.params.event;
let input = data.options[0].value;

// get information about the inputted channel
let channelinfo 
try {
 channelinfo = await lib.discord.channels['@0.3.1'].retrieve({
    channel_id: `${input}`,
  });
} catch (errorGettingChannelInfo) {
  console.error(
    `There was an error getting information about the channel (${input}):` +
      `\n` +
      `${errorGettingChannelInfo}`
  );
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${token}`,
    content: `There was an error getting information about the channel (${input}): ${errorGettingChannelInfo}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
}

// if it is not a voice channel, stop the code from executing
if (channelinfo.type !== 2) {
  console.error(`The provided channel is not a voice channel`);
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${token}`,
    content: `<#${input}> is not a valid voice channel. Please try again while providing a valid voice channel.`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
}

// get all kv pairs and filter those containing data about the specified VC
let kvpairs = await lib.utils.kv['@0.1.16'].entries();
let vcdata = kvpairs.filter((kvpair) => kvpair[1].channel_id == `${input}`);

// make a list of the people that are in the vc
let listofpeople = [];
for (let i = 0; i < vcdata.length; i++) {
  listofpeople.push(` <@${vcdata[i][1].userid}>`);
}

console.log(listofpeople);

// if there are no records found, that means that specified channel is empty
if (!listofpeople[0]) {
  console.error(`There were no people in the VC ${input}`);
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${token}`,
    content: `There are no people in <#${input}> at the moment. Please try again with another channel.`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
  // if there was data, that means there is at least 1 person in the vc. The member(s) are specified in the message.
} else {
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `These people are in the voice channel:`,
        description: '',
        color: 0x2b5a1a,
        fields: [
          {
            name: `Channel`,
            value: `<#${input}>`,
            inline: true,
          },
          {
            name: `Members in VC`,
            value: `${listofpeople}`,
            inline: true,
          },
        ],
      },
    ],
  });
}

/*
// get the information from the database of all records that include the specified channel
let datafromdb = await lib.http.request['@1.1.6'].post({
  url: `https://api.m3o.com/v1/db/Read`,
  authorization: `${m3oKey}`,
  headers: {
    'Content-Type': `application/json`,
  },
  params: {
    table: tablename,
    query: `channel_id == "${input}"`,
  },
});

// make a list of the people that are in the vc
let peopleinvc = datafromdb.data.records;
let listofpeople = [];
for (let i = 0; i < peopleinvc.length; i++) {
  listofpeople.push(` <@${peopleinvc[i].id}>`);
}
console.log(listofpeople);

// if there are no records found, that means that specified channel is empty
if (!listofpeople[0]) {
  console.error(`There were no people in the VC ${input}`);
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${token}`,
    content: `There are no people in <#${input}> at the moment. Please try again with another channel.`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
  // if there was data, that means there were some people in the vc. The members are specified in the message.
} else {
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `These people are in the voice channel:`,
        description: '',
        color: 0x2b5a1a,
        fields: [
          {
            name: `Channel`,
            value: `<#${input}>`,
            inline: true,
          },
          {
            name: `Members in VC`,
            value: `${listofpeople}`,
            inline: true,
          },
        ],
      },
    ],
  });
}
*/
