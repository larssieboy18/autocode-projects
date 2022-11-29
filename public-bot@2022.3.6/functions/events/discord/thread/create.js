const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.2.0'].threads.join({
  thread_id: `${context.params.event.id}`
});