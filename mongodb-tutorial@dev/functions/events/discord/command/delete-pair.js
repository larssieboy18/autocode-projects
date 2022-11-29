/*
Example for deleting an existing key/value-pair in your MongoDB database
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// allows use of the mongoDB functions
const mongodb = require('../../../../helpers/mongodb.js');

// sets other variables
let {member, data, channel_id, token, guild_id} = context.params.event;
let {options} = data;
let inputValue = options[0].value;

// ACK the interaction
await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${token}`,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE',
});

// delete the record that matched the provided input from the mongoDB
let deletion = await mongodb.deleteOne({tutorial: inputValue})

// if no deletion occured, send a message that there were no matched. Otherwise output a succes message.
if (deletion.deletedCount == 0) {
  await lib.discord.interactions['@1.0.1'].responses.update({
    token: `${token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `No matches found`,
        description: `There was no match for the value inputted by you. This means that there is no record that matches \`${inputValue}\` for \`tutorial\`. Please try again`,
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
        title: `Succesfully deleted the record`,
        description: `Succesfully deleted the record that matched \`${inputValue}\`.`,
        color: 0x2f3136,
      },
    ],
  });
}