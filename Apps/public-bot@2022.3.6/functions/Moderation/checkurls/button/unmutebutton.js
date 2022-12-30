const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let staffrole = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_staffrole`,
});
let muterole = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_muterole`,
});
let guildinfo = await lib.discord.guilds['@0.1.2'].retrieve({
  guild_id: `${context.params.event.guild_id}`,
  with_counts: false,
});
let logchannel = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_logchannel`,
});

// Only execute if the user is Staff
if (context.params.event.member.roles.includes(staffrole)) {
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

  // remove mute
  await lib.discord.guilds['@0.2.1'].members.timeout.destroy({
    user_id: `${unmuteduser}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `<@${unmuteduser}> has been unmuted.`,
  });
  await lib.discord.users['@0.1.5'].dms.create({
    recipient_id: `${unmuteduser}`,
    content: `Hi there. You were recently muted in ${guildinfo.name} because you send a link that was automatically marked as suspicious. Upon further review, we have determined that the URL was safe and therefore removed your mute! We hope to see you again soon in ${guildinfo.name}.`,
  });
  await lib.discord.channels['@0.2.2'].messages.destroy({
    message_id: context.params.event.message.id,
    channel_id: context.params.event.channel_id,
  });
} else {
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have sufficient permissions to interact with this button. Please make sure you have the staff role. If you believe this is an error, please contact a staff member.`,
  });
}
