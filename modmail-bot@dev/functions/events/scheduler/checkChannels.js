/*
Go through all kv entries, check if it is a valid channel, if not, poof gone
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// get all kv-pairs
let kvpairs = await lib.utils.kv['@0.1.16'].entries();

// make a RegExp
let modmailchannelregex = new RegExp(
  `\\b` + `\\d{18}` + `_${process.env.guildID}` + `_modmail` + `\\b`,
  `i`
);

// go through them all and delete the ones that are not matched to a valid channel ID
for (let i = 0; i < kvpairs.length; i++) {
  if (kvpairs[i][0].match(modmailchannelregex)) {
    try {
      let channelinfo = await lib.discord.channels['@0.3.1'].retrieve({
        channel_id: kvpairs[i][1],
      });
      console.log(
        `Channel ${channelinfo.name} (ID: ${kvpairs[i][1]}) still exists!`
      );
    } catch (channelDoesNotExist) {
      console.error(
        `A channel with the ID ${kvpairs[i][1]} does not exist, deleting the kv-pair`
      );
      await lib.utils.kv['@0.1.16'].clear({
        key: kvpairs[i][0],
      });
    }
  } 
}
