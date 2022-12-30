/*
This file will automatically deletes expired channels on a daily basis.
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// set variables
let guild = process.env.guildID;
let now = new Date().getTime();

// get the ID of the archive category
let archive = await lib.utils.kv['@0.1.16'].get({
  key: `${guild}_archivecategory`,
});

// get the ID of the logchannel in your guild
let logchannel = await lib.utils.kv['@0.1.16'].get({
  key: `${guild}_logchannel`,
});

// get a list of all channels in the guild
let channels = await lib.discord.guilds['@0.2.2'].channels.list({
  guild_id: `${guild}`,
});

for (let i = 0; i < channels.length; i++) {
  // only execute the following if the channel is part of the archive category
  if (channels[i].parent_id == `${archive}` && channels[i].id !== logchannel) {
    let channel = channels[i].id;
    let closetime = await lib.utils.kv['@0.1.16'].get({
      key: `${channel}_closetime`,
    });

    // if for whatever reason the "closetime" was not set correctly, set it to a week in the future
    if (new Date(Number(closetime)) == `Invalid Date` || closetime == null) {
      closetime = now + 604800000;
      await lib.utils.kv['@0.1.16'].set({
        key: `${channel}_closetime`,
        value: `${closetime}`,
      });
    }

    // set the date when the channel will be deleted
    let closedate =
      new Date(Number(closetime)).toLocaleDateString(`en-gb`, {
        year: `numeric`,
        month: `long`,
        day: `numeric`,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }) +
      ` ` +
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    // if the current time is "bigger" than when the modmail should have been closed, delete the channel.
    if (now > closetime) {
      try {
        let logmessage = await lib.utils.kv['@0.1.16'].get({
          key: `${channel}_logmessage`,
        });

        // get some information about the message that was send in the logchannel
        let logmessagecontent = (
          await lib.discord.channels['@0.3.0'].messages.retrieve({
            message_id: `${logmessage}`,
            channel_id: `${logchannel}`,
          })
        ).content;
        console.log(logmessagecontent);

        // remove the part of the message that mentions the channel, as the channel will get deleted
        await lib.discord.channels['@0.3.0'].messages.update({
          message_id: `${logmessage}`,
          channel_id: `${logchannel}`,
          content: logmessagecontent.replace(
            / or in \<\#\d{18}\> if the channel still exists/i,
            ''
          ),
        });

        // to clear up your KV-pairs, the logmessage entry will be deleted because it has not use anymore
        await lib.utils.kv['@0.1.16'].clear({
          key: `${channel}_logmessage`,
        });
      } catch (errorUpdatingLogMessage) {
        console.error(
          `The bot was unable to get the logmessage send inside #modmail-logs. This means that the message was probably deleted.\n${errorUpdatingLogMessage}`
        );
      }

      try {
        // delete the channel
        await lib.discord.channels['@0.3.0'].destroy({
          channel_id: `${channel}`,
        });
      } catch (errorDeletingChannel) {
        console.error(
          `The bot was unable to delete the archived modmail channel. The most likely cause for this is that the channel was already deleted. \n${errorDeletingChannel}`
        );
      }

      // delete the database entry for the channel that gets deleted
      await lib.http.request['@1.1.6'].post({
        url: `https://api.m3o.com/v1/db/DropTable`,
        authorization: `${process.env.m3oKey}`,
        headers: {
          'Content-Type': `application/json`,
        },
        params: {
          table: `${channel}`,
        },
      });

      // log the deletion of the channel to the console
      console.log(
        `${channels[i].name} (ID: ${channels[i].id}) was deleted.\nClosedate: ${closedate}.`
      );
    } else {
      // if the channel is going to be deleted, but it is not the right date yet, mention when the channel will get deleted.
      console.log(
        `${channels[i].name} (ID: ${channels[i].id}) will be deleted after ${closedate}.`
      );
    }
  } else {
    console.log(
      `${channels[i].name} (ID: ${channels[i].id}) is not part of the archived category`
    );
  }
}
