/*
Example for adding a new key/value-pair to your MongoDB database
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

// send the data to MongoDB
await mongodb.insertOne({tutorial: inputValue, addedBy: `${member.user.id}`});

// send a succes message in response!
await lib.discord.interactions['@1.0.1'].responses.update({
  token: `${token}`,
  content: `\`${inputValue}\` was succesfully added to the database by <@${member.user.id}>!`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
});
