/*
Example for updating a specific key/value-pair. 
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// allows use of the mongoDB functions
const mongodb = require('../../../../helpers/mongodb.js');

// sets other variables
let {member, data, channel_id, token, guild_id} = context.params.event;
let {options} = data;
let oldValue = options[0].value;
let newValue = options[1].value;

// ACK the interaction
await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${token}`,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE',
});

// look up the first field that matches the filter (oldValue) and update it to newValue
let update = await mongodb.updateOne(
  {tutorial: oldValue},
  {tutorial: newValue}
);
let {matchedCount, modifiedCount} = update;

// send a success/fail message depending on the result
if (matchedCount > 0 && modifiedCount > 0) {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `Succesfully updated`,
        description: `Succesfully updated \`${oldValue}\` to \`${newValue}\`!`,
        color: 0x2f3136,
      },
    ],
  });
} else if (matchedCount == 0) {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `No matches found`,
        description: `There were no matches found for \`${oldValue}\`. Please try again with a different old value.`,
        color: 0x2f3136,
      },
    ],
  });
} else if (matchedCount > 0 && modifiedCount == 0) {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `Error`,
        description: `A match was found, but the bot was not able to update the record. Please check your code and try again.`,
        color: 0x2f3136,
      },
    ],
  });
} else {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `Error`,
        description: `An error occured. Please try again after checking your logs.`,
        color: 0x2f3136,
      },
    ],
  });
}
