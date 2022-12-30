// set variables
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let channel = process.env.channelID;
let lastSticky = await lib.utils.kv['@0.1.16'].get({
  key: `${channel}_sticky`,
  defaultValue: `0`,
});

// get data about the latest sticky message
let dataLastSticky = await lib.discord.channels['@0.3.0'].messages.retrieve({
  message_id: `${lastSticky}`,
  channel_id: `${channel}`,
});

// get info about the latests messages
let messages = await lib.discord.channels['@0.3.0'].messages.list({
  channel_id: `${channel}`,
  before: `${lastSticky}`,
  limit: 25, // change this based on the activity in your channel. Needs to be a value between 1-100.
});

// delete all messages that have the same title as the latest embed
for (let i = 0; i < 50; i++) {
  try {
    if (messages[i].embeds[0].title == dataLastSticky.embeds[0].title) {
      console.log(`Sticky message found in message ${i}, deleting it now...`);
      await lib.discord.channels['@0.3.0'].messages.destroy({
        message_id: `${messages[i].id}`,
        channel_id: `${channel}`,
      });
    }
  } catch (error) {
    console.log(`Probably no embed in message ${i}.`);
  }
}

/*
If the above gives you the error "Unknown Message" (code 10008), it is because the lastSticky value was not set properly.
Wait until a new sticky messages is send and it will be fixed. 
*/
