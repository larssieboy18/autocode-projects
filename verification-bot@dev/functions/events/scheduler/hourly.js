/*
To prevent new channels from being accessible by non-verified users,
run an hourly program that denies view permissions to all channels, except the verification channel
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// set some information about the non-verified role
let nonverifiedrole = await lib.utils.kv['@0.1.16'].get({
  key: `${process.env.guildID}_nonverifiedrole`,
});

// this gets a list (in array format) of all channels in the guild that the command was run in.
let channels = await lib.discord.guilds['@0.2.2'].channels.list({
  guild_id: `${process.env.guildID}`,
});

// go through all channels and deny view permissions for the non-verified role if that is not already the case
// it looks very complicated and could probably be done simpler, but it works :)
for (let i = 0; i < channels.length; i++) {
  if (channels[i].name !== `verification`) {
    if (channels[i].permission_overwrites.length == 0) {
      await lib.discord.channels['@0.3.0'].permissions.update({
        overwrite_id: `${nonverifiedrole}`,
        channel_id: `${channels[i].id}`,
        deny: `1024`,
        type: 0,
      });
      console.log(
        `Updated permissions for ${channels[i].name} (${channels[i].id})`
      );
    } else {
      for (let j = 0; j < channels[i].permission_overwrites.length; j++) {
        if (channels[i].permission_overwrites[j].id == `${nonverifiedrole}`) {
          console.log(
            `Permissions have already been set for ${channels[i].name}`
          );
        } else {
          await lib.discord.channels['@0.3.0'].permissions.update({
            overwrite_id: `${nonverifiedrole}`,
            channel_id: `${channels[i].id}`,
            deny: `1024`,
            type: 0,
          });
          console.log(
            `Updated permissions for ${channels[i].name} (${channels[i].id})`
          );
        }
      }
    }
  }
}
