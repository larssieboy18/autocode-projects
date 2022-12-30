// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../../../../helpers/helper.js');
let guild = process.env.guildID;
let channeltoclose = context.params.event.channel_id;
let staffrole = process.env.staffroleID;

// check whether or not the guild is the same as provided in the variables
if (context.params.event.guild_id !== guild) {
  console.error(`The guild you have provided in the variables (${guild}) does not match this guild (${context.params.event.guild_id}). This will most likely result in the bot not working properly. Support for this is NOT provided under any circumstances.`)
}

// make sure the button only works for staff members
if (context.params.event.member.roles.includes(staffrole)) {
  console.log(`close`);
  // list all pinned messages inside a modmail (the initial message automatically gets pinned)
  let pinnedmessages = await lib.discord.channels['@0.3.0'].pins.list({
    channel_id: `${channeltoclose}`,
  });

  let closeandmove = await helpers.close_modmail(
    guild,
    channeltoclose,
    context.params.event.token,
    pinnedmessages
  );
  
  if (
    closeandmove.content !==
    `This modmail has already been archived. Please select a different channel.`
  ) {
    // to make sure we only get back the initial message, get rid of everything else
    let initialmessage = pinnedmessages.slice(-1);

    // extract the member that the modmail is with from the modmail
    let member = initialmessage[0].mentions[0];

    await helpers.messages_fromdb_tolog(channeltoclose, guild, member, pinnedmessages);
  } else {
    console.error(
      `This channel is not an open modmail. Please select a different channel.`
    );
  }
} else {
  console.error(
    `User ${context.params.event.member.user.id} tried pressing the close button, but they do not have the staffrole. `,
    `Please verifiy that your modmail category and channels are only accessible for staff members.`
  );
}
