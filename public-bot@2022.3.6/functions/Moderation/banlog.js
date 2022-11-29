const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// create sleep
let sleep = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms || 0);
  });
};

// set variables
let logchannel = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_logchannel`,
});
let guildinfo = await lib.discord.guilds['@0.1.2'].retrieve({
  guild_id: `${context.params.event.guild_id}`,
  with_counts: false,
});
let casenumber = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_casenumber`,
  defaultValue: 1,
});

// set date
const now = new Date();
var unixTime = Math.round(new Date(`${now}`).getTime() / 1000);

await sleep(1000);

// get info from the audit log for the latest ban
let auditinfo = await lib.discord.guilds['@0.2.1'].auditLogs.list({
  guild_id: `${context.params.event.guild_id}`,
  action_type: 22,
  limit: 1,
});

// get details from the audit log
let banneduser = auditinfo.audit_log_entries[0].target_id;
let banreason = auditinfo.audit_log_entries[0].reason;
let moderator = auditinfo.audit_log_entries[0].user_id;

// create log message
await lib.discord.channels['@0.1.1'].messages.create({
  channel_id: `${logchannel}`,
  content: `**Moderation Logs |** Ban #${casenumber}`,
  tts: false,
  embed: {
    type: 'rich',
    title: 'Ban',
    description: `A user was banned in ${guildinfo.name}!`,
    color: 0xcc2936,
    fields: [
      {
        name: 'User | 👤',
        value: `<@!${banneduser}> (${banneduser})`,
      },
      {
        name: 'Reason | ❓',
        value: `${banreason}`,
      },
      {
        name: 'Moderator | 🔒',
        value: `<@!${moderator}>`,
      },
      {
        name: 'Time | ⏱️',
        value: `<t:${unixTime}> (<t:${unixTime}:R>)`,
      },
    ],
  },
});

// set next case number
let newcasenumber = await lib.utils.kv['@0.1.16'].set({
  key: `${context.params.event.guild_id}_casenumber`,
  value: ++casenumber,
});
