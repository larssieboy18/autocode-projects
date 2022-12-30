/*
Send a message inside the modmail if the user leaves the server
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let guild = process.env.guildID;
let {user, guild_id} = context.params.event;

if (guild_id == guild) {
  // check if the user already has an open modmail
  let modmail = await lib.utils.kv['@0.1.16'].get({
    key: `${user.id}_${guild}_modmail`,
    defaultValue: false,
  });

  if (modmail !== false) {
    // send a leave message inside the modmail
    let message = await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${modmail}`,
      content: `**The user has left the server.**`,
    });
    // get the current messagecount
    let messagecount = await lib.utils.kv['@0.1.16'].get({
      key: `${modmail}_messagecount`,
      defaultValue: 0,
    });

    let time =
      new Date().toLocaleDateString(`en-gb`, {
        year: `numeric`,
        month: `long`,
        day: `numeric`,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }) +
      ` ` +
      // be aware that this will get the timezone that Autocode uses (which is UTC) and not your own timezone
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    // log the message in the database
    let logtodb = await lib.http.request['@1.1.6'].post({
      url: `https://api.m3o.com/v1/db/Create`,
      authorization: `${process.env.m3oKey}`,
      headers: {
        'Content-Type': `application/json`,
      },
      params: {
        record: {
          id: `${messagecount}`,
          User: `${user.username}`,
          Userid: `${user.id}`,
          Timestamp: `${time}`,
          Message: `${message.content.replace(/\*\*/gi, '')}`,
          Direction: `SYSTEM MESSAGE`,
        },
        table: `${modmail}`,
      },
    });

    // send success message inside the console
    console.log(`Message logged to id ${logtodb.data.id}`);

    // increment the messagecount
    await lib.utils.kv['@0.1.16'].set({
      key: `${modmail}_messagecount`,
      value: ++messagecount,
    });
  } else {
    console.log(`User ${user.id} did not have any open modmails`);
  }
} else {
  console.log(`User left a guild, but not the one modmail was installed into`);
}
