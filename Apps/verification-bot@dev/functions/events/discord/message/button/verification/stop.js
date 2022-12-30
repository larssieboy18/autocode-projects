/*
This only runs if the bot has detected that there already is a channel called verification and the user decides
to stop the creation of the role and channel.
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
  token: `${context.params.event.token}`,
  content: `The creation of the verification role and channel has been stopped. If you want to proceed anyway, run the command again and click \"continue anyway\" or deletete the verification channel.`
});