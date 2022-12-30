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
  let banneduser = result.mentions[0].id;

  // Get info about the user
  let userinfo = await lib.discord.guilds['@0.1.0'].members.retrieve({
    user_id: banneduser,
    guild_id: `${context.params.event.guild_id}`,
  });

  // If user has staffrole, do not ban them. If not, then the user gets banned.
  if (userinfo.roles.includes(staffRole)) {
    await lib.discord.channels['@0.2.1'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `You are not allowed to ban a fellow staff member. Please inform the owner that a staff member's account has been compromised.`,
    });
  } else {
    await lib.discord.guilds['@0.1.0'].bans.create({
      user_id: `${banneduser}`,
      guild_id: `${context.params.event.guild_id}`,
      delete_message_days: 1,
      reason: `Sending suspicious links, confirmed by ${context.params.event.member.user.username}`,
    });
  }
} else {
  console.log(
    `A non-staff member tried to click a button. Make sure you either 1. lock the modlog channel to staff members or 2. have the right staff role set in the variables`
  );
}

// Feel free to ping Lars.#0018 (<@119473151913623552>) in the Autocode Discord server for help or suggestions!
