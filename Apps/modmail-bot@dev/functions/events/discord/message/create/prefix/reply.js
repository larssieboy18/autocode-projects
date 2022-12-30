// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// enables use of the helper file
const helpers = require('../../../../../../helpers/helper.js');

let text = context.params.event.content.replace(/\!reply\s/i, '');
let direction = `Staff to user`;

// check whether or not the guild is the same as provided in the variables
if (context.params.event.guild_id !== process.env.guildID) {
  console.error(`The guild you have provided in the variables (${guild}) does not match this guild (${context.params.event.guild_id}). This will most likely result in the bot not working properly. Support for this is NOT provided under any circumstances.`)
}

// get info about the channel the command was executed in
let channelinfo = await lib.discord.channels['@0.3.0'].retrieve({
  channel_id: `${context.params.event.channel_id}`,
});

// use the helper file to reply
await helpers.reply_modmail(context.params.event, text, channelinfo);

// log the message to a database
await helpers.log_message(
  context.params.event.channel_id,
  context.params.event,
  text,
  direction,
);
