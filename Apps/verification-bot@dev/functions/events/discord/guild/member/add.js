// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// set some information about the non-verified role
let nonverifiedrole = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_nonverifiedrole`,
});

// gives the user the non-verified role
await lib.discord.guilds['@0.2.2'].members.roles.update({
  role_id: `${nonverifiedrole}`,
  user_id: `${context.params.event.user.id}`,
  guild_id: `${context.params.event.guild_id}`
});