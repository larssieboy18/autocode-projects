/*
Only allow messages in a specified text channel if the user is in the specified voice channel.
This snippet requires that you first install this app: https://autocode.com/app/creepertown/log-all-people-in-vc/
*/

/*
This snippet relies on https://autocode.com/app/creepertown/log-all-people-in-vc/
If you do not have this app installed and properly configured, this snippet WILL NOT work!
If you have any questions, please do not hesitate to contact me by sending Lars.#0018 a message inside the Autocode Discord server
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// set variables
let textchannel = process.env.textChannelID;
let voicechannel = process.env.voiceChannelID;
let ignoredRoles = process.env.ignoredRoles.split(`,`);

// set more variables
let {
  guild_id,
  channel_id,
  member,
  author,
  id: message_id,
} = context.params.event;

// only execute the code for the specified text channel
if (channel_id !== textchannel) {
  return console.log(`Code is not aimed at this text channel, ignoring...`);
}

// stop executing the code if the user has one (or more) ignored roles
for (let i = 0; i < ignoredRoles.length; i++) {
  if (member.roles.includes(ignoredRoles[i])) {
    return console.log(`User has an ignored role, ignoring...`);
  }
}

// get the current info from the kv-pairs
let userdata = await lib.utils.kv['@0.1.16'].get({
  key: `${author.id}_${guild_id}_voiceState`,
  defaultValue: {
    channel_id: null,
  },
});

// if the userdata does not include the right voice channel, delete their message
if (userdata.channel_id !== voicechannel) {
  console.log(
    `${author.username}#${author.discriminator} is not in the voice channel. Deleting their message`
  );
  // actually delete the message
  try {
    await lib.discord.channels['@0.3.1'].messages.destroy({
      message_id: `${message_id}`,
      channel_id: `${channel_id}`,
    });
  } catch (errorDeletingMessage) {
    console.error(
      `An error occured deleting the message, this most likely means the message was already deleted.`
    );
    console.error(errorDeletingMessage);
  }
  // check if the user was already notified in the past 5 minutes
  let userNotified = await lib.utils.kv['@0.1.16'].get({
    key: `${author.id}_${textchannel}_notification`,
    defaultValue: false,
  });
  // if the user was not yet notified, notify the user
  if (userNotified == false) {
    console.log(`Notifying the user about not being in the VC.`);
    try {
      let notificationMessage = await lib.discord.channels[
        '@0.3.1'
      ].messages.create({
        channel_id: `${channel_id}`,
        content: `Hi <@${author.id}>! In order to be able to talk in this channel, you need to be in <#${voicechannel}>.`,
      });
      await lib.utils.kv['@0.1.16'].set({
        key: `${author.id}_${textchannel}_notification`,
        value: true,
        ttl: 300,
      });
    } catch (errorSendingNotification) {
      console.error(
        `There was an error sending the notification, probably because the bot does not have sufficient permissions to send messages in this channel.`
      );
      console.error(errorSendingNotification);
    }
    // if the user was already notified, do not notify them again.
  } else {
    console.log(
      `The user was notified in the past 5 minutes. Not notifying again.`
    );
  }
  // if the user is in the voice channel, there is nothing that needs to be done :)
} else {
  console.log(`User is in the voice channel, nothing needs to be done`);
}
