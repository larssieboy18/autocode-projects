// set variables
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let channel = process.env.channelID;
let lastSticky = await lib.utils.kv['@0.1.16'].get({
  key: `${channel}_sticky`,
  defaultValue: 0,
});

// check if the message was send in the designated channel
if (context.params.event.channel_id == channel) {
  if (lastSticky !== 0) {
    // only execute the following if a sticky message already has been send
    try {
      await lib.discord.channels['@0.3.0'].messages.destroy({
        message_id: `${lastSticky}`,
        channel_id: `${context.params.event.channel_id}`,
      });
    } catch (error) {
      console.error(
        `Error occured, probably because the previous sticky message was already deleted.\n${error}`
      );
    }
    await lib.utils.kv['@0.1.16'].clear({
      key: `${context.params.event.channel_id}_sticky`,
    });
  }
  // create a new sticky message. Edit the contents using the embed builder you can find here: https://autocode.com/tools/discord/embed-builder/
  // make sure NOT to delete the "let newSticky = part"
  let newSticky = await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Sticky message`,
        description: `This is a message that will appear every time someone sends a message in this channel! You can edit my contents in the [Autocode project](https://autocode.com)!`,
        color: 0x00ffff,
      },
    ],
  });
  // Do not delete the part below if you edited the message contents
  // set the new kV value so the bot knows that this is a sticky message
  try {
    await lib.utils.kv['@0.1.16'].set({
      key: `${channel}_sticky`,
      value: `${newSticky.id}`,
    });
  } catch (error) {
    console.error(
      `Error occured! You probably deleted the "let newSticky = " part in the code above. Please check your code.\nError: ${error}`
    );
  }
}
