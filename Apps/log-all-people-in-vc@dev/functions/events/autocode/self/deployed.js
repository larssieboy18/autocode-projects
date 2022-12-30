// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// you can change this based on your needs
let guild = process.env.guildID;

// create the necessary commands

// invc command
await lib.discord.commands['@0.0.0'].create({
  guild_id: `${guild}`,
  name: 'invc',
  description: 'Get a list of all users that are in the provided voice channel',
  options: [
    {
      type: 7,
      name: 'voice_channel',
      description: 'The channel you want to list the users for',
      required: true,
    },
  ],
});
console.log(`Succesfully created the invc command`);

// vc-status command
await lib.discord.commands['@0.0.0'].create({
  guild_id: `${guild}`,
  name: 'vc-status',
  description: 'Get vc information about a user ',
  options: [
    {
      type: 6,
      name: 'user',
      description: 'The user you want to get the information of',
      required: true,
    },
  ],
});
console.log(`Succesfully created the vc-status commands`);

// tablename command is not needed anymore thanks to the switch to kv-pairs

// // tablename command
// await lib.discord.commands['@0.0.0'].create({
  // guild_id: `${guild}`,
  // name: 'tablename',
  // description:
    // 'Get the name of the database table that is used for this guild',
  // options: [],
// });
// console.log(`Succesfully created the tablename command`);
