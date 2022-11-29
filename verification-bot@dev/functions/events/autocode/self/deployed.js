// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// automatically create the command used in this app
await lib.discord.commands['@0.0.0'].create({
  guild_id: `${process.env.guildID}`,
  name: 'verification',
  description: 'Create a verification channel',
  options: [
    {
      type: 1,
      name: 'create',
      description: 'Create a verification channel',
    },
  ],
});
