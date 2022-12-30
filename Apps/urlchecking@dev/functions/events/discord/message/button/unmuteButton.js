// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let staffRole = process.env.STAFFROLE;

// Only execute if the user is Staff
if (context.params.event.member.roles.includes(staffRole)) {
  // Get data about log message
  let result = await lib.discord.channels['@0.2.1'].messages.retrieve({
    message_id: context.params.event.message.id,
    channel_id: context.params.event.channel_id,
  });

  // Get user's ID by checking who was mentioned in the message
  let unmuteduser = result.mentions[0].id;

  // Get info about the user
  let userinfo = await lib.discord.guilds['@0.1.0'].members.retrieve({
    user_id: unmuteduser,
    guild_id: `${context.params.event.guild_id}`,
  });

  // Remove timeout
  await lib.discord.guilds['@0.2.2'].members.timeout.destroy({
    user_id: `${unmuteduser}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  await lib.discord.channels['@0.2.1'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@${unmuteduser}> has been unmuted by <@${context.params.event.member.user.id}>`,
  });
  await lib.discord.users['@0.1.5'].dms.create({
    recipient_id: `${unmuteduser}`,
    content: `Hi there. You were recently muted in ${process.env.SERVERNAME} because you send a link that was automatically marked as suspicious. Upon further review, we have determined that the URL was safe and therefore removed your mute role! We hope to see you again soon in ${process.env.SERVERNAME}.`,
  });
} else {
  console.log(
    `A non-staff member tried to click a button. Make sure you either 1. lock the modlog channel to staff members or 2. have the right staff role set in the variables`
  );
}

// Feel free to ping Lars.#0018 (<@119473151913623552>) in the Autocode Discord server for help or suggestions!
