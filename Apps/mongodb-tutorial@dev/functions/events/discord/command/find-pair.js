/*
Example for finding a specific key/value-pair.
For this example, it looks for everything that has been added by the person running the command.
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// allows use of the mongoDB functions
const mongodb = require('../../../../helpers/mongodb.js');

// sets other variables
let {member, data, channel_id, token, guild_id} = context.params.event;
let {options} = data;
let inputUser = options[0].value;

// ACK the interaction
await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${token}`,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE',
});

// look up the data inside MongoDB that matches the inputted user
let dbmatches = await mongodb.findMultiple({addedBy: `${inputUser}`});
console.log(dbmatches);

let fieldData = [];

// if any matches are found, continue with this
if (dbmatches.length > 0) {
  // make an array with all matches founds
  for (let i = 0; i < dbmatches.length; i++) {
    let userinfo = await lib.discord.guilds['@0.2.4'].members.retrieve({
      user_id: `${dbmatches[i].addedBy}`,
      guild_id: `${guild_id}`,
    });
    let createField = {
      name: `Added by ${userinfo.user.username}#${userinfo.user.discriminator}`,
      value: `${dbmatches[i].tutorial}`,
    };
    fieldData.push(createField);
  }

  // send a response with all the results
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `Database results`,
        description: '',
        color: 0x2f3136,
        fields: fieldData,
      },
    ],
  });
} else {
  // if no matches are found, post a no results message
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `No results founds`,
        description:
          'There were no database records found that matched your query. Please try again!',
        color: 0x2f3136,
      },
    ],
  });
}
