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
var unixTime = Math.round(new Date(`${now}`).getTime() / 1000);

if (
  context.params.event.member.roles.includes(staffrole) ||
  context.params.event.member.permission_names.includes(`BAN_MEMBERS`) ||
  context.params.event.member.permission_names.includes(`KICK_MEMBERS`) ||
  context.params.event.member.permission_names.includes(`ADMINISTRATOR`)
) {
  if (!logchannel || !staffrole) {
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You have not completed the setup for NADB. Please set your logchannel and staffrole by doing \`/config set\``,
    });
  } else {
    let userId = context.params.event.data.options[0].value;
    let reason = context.params.event.data.options[1].value;
    try {
      await lib.discord.users['@0.1.1'].dms.create({
        recipient_id: `${userId}`,
        content: `**${guildinfo.name} Alert**`,
        tts: false,
        embed: {
          type: 'rich',
          title: 'Warned',
          description: `You've been warned in ${guildinfo.name}.`,
          color: 0xe09f3e,
          fields: [
            {
              name: 'Warning',
              value: `${reason}`,
            },
            {
              name: 'Issue?',
              value: `Does this seem wrong? Send someone with the <@&${staffrole}>-role a message and we will get it sorted`,
            },
          ],
        },
      });
    } catch (error) {
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: "User has DM's disabled. No DM has been send",
      });
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }
    if (logchannel) {
      await lib.discord.channels['@0.1.1'].messages.create({
        channel_id: `${logchannel}`,
        content: '**Moderation Logs |** Warn',
        tts: false,
        embed: {
          type: 'rich',
          title: 'Warn',
          description: `A user was warned in ${guildinfo.name}!`,
          color: 0xe09f3e,
          fields: [
            {
              name: 'User | 👤',
              value: `<@!${userId}> (${userId})`,
            },
            {
              name: 'Warning | ⚠️',
              value: `${reason}`,
            },
            {
              name: 'Moderator | 🔒',
              value: `<@!${context.params.event.member.user.id}>`,
            },
            {
              name: 'Time | ⏱️',
              value: `<t:${unixTime}>`,
            },
          ],
        },
      });
    } else {
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `No logchannel has been set. Please set one using \`/logchannel\` to log warnings in the future`,
      });
    }

    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `**User Warned** - ${reason}`,
      tts: false,
    });
  }
} else {
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have the correct permissions for /warn, <@!${context.params.event.member.user.id}>. You need the <@&${staffrole} role.`,
  });
}
