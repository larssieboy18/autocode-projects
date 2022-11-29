/*
This file handles a user's message in DM
DO NOT USE CONTEXT.PARAMS.EVENT.GUILD_ID IN THIS! --> it's not being used in a guild, but in DM's :)
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// sets the guild variable
let guild = process.env.guildID;

// check whether or not /modmail setup has ran already or not
let modmailEnabled = await lib.utils.kv['@0.1.16'].get({
  key: `${guild}_modmailEnabled`,
  defaultValue: false,
});

// if /modmail setup has not yet run, there is no reason to process the DM
if (modmailEnabled == false) {
  // reacts to the message to show the user that the message was not processed properly
  await lib.discord.channels['@0.3.0'].messages.reactions.create({
    emoji: `❌`,
    message_id: context.params.event.id,
    channel_id: context.params.event.channel_id,
  });
  console.error(
    `Modmail has not been setup in the server (ID: ${guild}) yet, please run /modmail setup inside the Discord server first.`
  );
} else {
  // enables use of the helper file
  const helpers = require('../../../../helpers/helper.js');

  // set variables
  let username = context.params.event.author.username.replace(/\W/gi, ``);
  let discriminator = context.params.event.author.discriminator;
  let staffrole = process.env.staffroleID;

  // allow sleep
  let sleep = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  // get more info about the user
  let userinfo = await lib.discord.users['@0.2.0'].retrieve({
    user_id: `${context.params.event.author.id}`,
  });

  // get more info about the user in the guild, like roles etc
  let memberinfo = await lib.discord.guilds['@0.2.2'].members.retrieve({
    user_id: `${context.params.event.author.id}`,
    guild_id: `${guild}`,
  });

  // gets modmail category
  let modmailcategory = await lib.utils.kv['@0.1.16'].get({
    key: `${guild}_modmailcategory`,
  });

  // check if the user already has an open modmail
  let modmail = await lib.utils.kv['@0.1.16'].get({
    key: `${context.params.event.author.id}_${guild}_modmail`,
    defaultValue: false,
  });
  console.log(
    `Does user have a modmail open? (Response either false or channel ID)`,
    modmail
  );

  // if user does not have an existing modmail, make a new one
  if (modmail == false) {
    await helpers.open_modmail(
      context.params.event.author.id,
      context.params.event.author.username,
      context.params.event.author.discriminator,
      guild,
      modmailcategory,
      context.params.event.content,
      memberinfo,
      staffrole,
      `by`
    );

    // the first message does not accept attachments. This sends a DM to the user asking them to send it again
    if (context.params.event.attachments.length > 0) {
      await lib.discord.users['@0.2.0'].dms.create({
        recipient_id: context.params.event.author.id,
        content: `Hi there! Unfortunately you are unable to send attachments as the first message. Please send it again if you want staff members to see it.`,
      });
    }

    // get the ID of the modmail channel
    let modmailchannel = await lib.utils.kv['@0.1.16'].get({
      key: `${context.params.event.author.id}_${guild}_modmail`,
    });

    let direction = `Initial message`;

    // log the message to a database
    await helpers.log_message(
      modmailchannel,
      context.params.event,
      context.params.event.content,
      direction
    );

    // confirm to the user that the message has been succesfully opened by reacting with a checkmark
    await lib.discord.channels['@0.3.0'].messages.reactions.create({
      emoji: `✅`,
      message_id: `${context.params.event.id}`,
      channel_id: `${context.params.event.channel_id}`,
    });

    // if the user does have an open modmail, send their message in the modmail channel
  } else {
    await helpers.dm_to_modmail(modmail, context.params.event);

    let direction = `User to staff`;

    // log the message to a database
    await helpers.log_message(
      modmail,
      context.params.event,
      context.params.event.content,
      direction
    );
  }
}
