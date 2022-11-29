// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// because the same code is used in 3 seperate files, we use a helper file for this. It is located in the helpers folder.
const helpers = require('../../../../../../helpers/verification/shared.js');

// this just executes the helper file.
await helpers.fail(
  context.params.event.member.user.id,
  context.params.event.guild_id,
  context.params.event.token
);