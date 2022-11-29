const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let logchannel = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_logchannel`,
});
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

const now = new Date();
var unixtime = Math.round(new Date(`${now}`).getTime() / 1000);

if (
  context.params.event.member.roles.includes(staffrole) ||
  context.params.event.member.permission_names.includes(`BAN_MEMBERS`) ||
  context.params.event.member.permission_names.includes(`ADMINISTRATOR`)
) {
  let userId = context.params.event.data.options[0].value;
  let result = await lib.discord.guilds['@0.1.0'].bans.destroy({
    user_id: `${userId}`,
    guild_id: `${context.params.event.guild_id}`,
  });

  await lib.discord.channels['@0.1.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `**User Unbanned** - ${reason}`,
    tts: false,
  });
} else {
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have the correct permissions for /unban, <@!${context.params.event.member.user.id}>. You need the <@&${staffrole} role.`,
  });
}
