/*
This file does exactly the same as the verification.js file. If you want to see how it works,
please check out that file for the comments.
This file only runs after the bot has detected that there already is a channel called "verification",
and the user pressed the continue anyways button.
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// lists the permissions that the user running the command has
let permissiondata = context.params.event.member.permission_names;

if (
  permissiondata.includes('MANAGE_GUILD') ||
  permissiondata.includes('ADMINISTRATOR')
) {
let verifyrole = await lib.discord.guilds['@0.2.2'].roles.create({
  guild_id: `${context.params.event.guild_id}`,
  name: `Needs to verify`,
  permissions: `0`,
  hoist: false,
  mentionable: false,
});

await lib.utils.kv['@0.1.16'].set({
  key: `${context.params.event.guild_id}_nonverifiedrole`,
  value: `${verifyrole.id}`,
});

console.log(`Info about the verification role:`);
console.log(verifyrole);

for (let z = 0; z < channels.length; z++) {
  let channeloverwrite = await lib.discord.channels[
    '@0.3.0'
  ].permissions.update({
    overwrite_id: `${verifyrole.id}`,
    channel_id: `${channels[z].id}`,
    deny: `1024`,
    type: 0,
  });
}

let verifychannel = await lib.discord.guilds['@0.2.2'].channels.create({
  guild_id: `${context.params.event.guild_id}`,
  name: `verification hi ha hoo`,
  type: 0,
  topic: `Click the green button to be let in to the server.`,
  permission_overwrites: [
    {
      id: `${verifyrole.id}`,
      type: 0,
      allow: 1024,
    },
    {
      id: `${context.params.event.guild_id}`,
      type: 0,
      deny: 377957125184,
    },
    // if you want staff members to also have access to the channel, uncomment the following section and replace STAFFROLE_ID_HERE with the ID of your staff's role
    // {
    // id: STAFFROLE_ID_HERE,
    // type: 0,
    // allow: 1024,
    // },
  ],
});

await lib.discord.guilds['@0.2.2'].channels.update({
  guild_id: `${context.params.event.guild_id}`,
  id: `${verifychannel.id}`,
  position: 0,
});

await lib.utils.kv['@0.1.16'].set({
  key: `${context.params.event.guild_id}_verificationchannel`,
  value: `${verifychannel.id}`,
});

console.log(`Info about the verification channel:`);
console.log(verifychannel);
}