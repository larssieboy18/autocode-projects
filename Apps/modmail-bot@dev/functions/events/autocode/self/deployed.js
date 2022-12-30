/*
Creates the command upon installation. If for any reason it failed during installation or you want to move it to a new server,
doublecheck the guild ID in the environment variables and run it again.
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let guild = process.env.guildID

// allow for a new setup after the bot has been installed
await lib.utils.kv['@0.1.16'].clear({
  key: `${guild}_modmailEnabled`,
});

// create the command in the guild that is provided in the environment variables
await lib.discord.commands['@0.0.0'].create({
  guild_id: `${guild}`,
  name: 'modmail',
  description: 'All commands related to modmail [STAFF ONLY]',
  options: [
    {
      type: 1,
      name: 'setup',
      description: 'Setup the modmail bot',
      options: [
        {
          type: 7,
          name: 'category',
          description:
            'The category that modmail should use. If none is provided, it will create one',
        },
      ],
    },
    {
      type: 1,
      name: 'open',
      description: 'Open a new modmail for a user',
      options: [
        {
          type: 6,
          name: 'user',
          description: 'The user that the modmail should be opened for',
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: 'close',
      description: 'Close the selected modmail',
      options: [
        {
          type: 7,
          name: 'modmail',
          description: 'The modmail you want to close',
        },
      ],
    },
  ],
});
