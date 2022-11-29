// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// enables use of the helper file
const helpers = require('../../../../../../helpers/helper.js');

let text = context.params.event.content.replace(/\!note\s/i, '');
let guild = process.env.guildID;
let direction = `Note`;

// check whether or not the guild is the same as provided in the variables
if (context.params.event.guild_id !== guild) {
  console.error(`The guild you have provided in the variables (${guild}) does not match this guild (${context.params.event.guild_id}). This will most likely result in the bot not working properly. Support for this is NOT provided under any circumstances.`)
}

// get info about the channel the command was executed in
let channelinfo = await lib.discord.channels['@0.3.0'].retrieve({
  channel_id: `${context.params.event.channel_id}`,
});

// gets modmail category
let modmailcategory = await lib.utils.kv['@0.1.16'].get({
  key: `${guild}_modmailcategory`,
});

// if the command was not executed inside the modmail category, ignore it
if (channelinfo.parent_id !== modmailcategory) {
  return console.error(
    `Command '${context.params.event.content}' was not executed inside the modmail category. Ignoring...`
  );
} else {
  // log the message to a database
  await helpers.log_message(
    context.params.event.channel_id,
    context.params.event,
    text,
    direction
  );

  await lib.discord.channels['@0.3.0'].messages.reactions.create({
    emoji: `✅`,
    message_id: `${context.params.event.id}`,
    channel_id: `${context.params.event.channel_id}`,
  });
}
