/*

This file may be used for manually clearing the KV-pair for a certain user. Input the user ID where it asks for it and click the run button on the bottom right to manually clear a kv-pair.
This should only be done if any bugs occur and the KV-pair is the reason for the issues.

*/


// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let user = `USER_ID_HERE`

await lib.utils.kv['@0.1.16'].clear({
  key: `${user}_${process.env.guildID}_modmail`
});

return console.log(`Succesfully cleared the kv-pair ${user}_${process.env.guildID}_modmail`)