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
let casenumber = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_casenumber`,
  defaultValue: 1,
});

const now = new Date();
var unixtime = Math.round(new Date(`${now}`).getTime() / 1000);

if (
  context.params.event.member.roles.includes(staffrole) ||
  context.params.event.member.permission_names.includes(`BAN_MEMBERS`) ||
  context.params.event.member.permission_names.includes(`KICK_MEMBERS`) ||
  context.params.event.member.permission_names.includes(`ADMINISTRATOR`)
) {
  let userId = context.params.event.data.options[0].value;
  let reason = context.params.event.data.options[1].value;
  let muteduserinfo = await lib.discord.guilds['@0.1.3'].members.retrieve({
    user_id: `${context.params.event.data.options[0].value}`,
    guild_id: `${context.params.event.guild_id}`,
  });

  let modinfo = await lib.discord.guilds['@0.1.3'].members.retrieve({
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });

  var positionmod = await lib.discord.guilds['@0.1.0'].roles
    .list({
      guild_id: `${context.params.event.guild_id}`,
    })
    .then((roles) => roles.find((x) => x.id === `${modinfo.roles[0]}`));
  if (!modinfo.roles[0]) {
    var positionmod = {position: 0};
  }
  var positionuser = await lib.discord.guilds['@0.1.0'].roles
    .list({
      guild_id: `${context.params.event.guild_id}`,
    })
    .then((roles) => roles.find((x) => x.id === `${muteduserinfo.roles[0]}`));
  if (!muteduserinfo.roles[0]) {
    var positionuser = {position: 0};
  }

  if (positionmod.position > positionuser.position) {
    try {
      await lib.discord.users['@0.1.1'].dms.create({
        recipient_id: `${userId}`,
        content: `**${guildinfo.name} Alert**`,
        tts: false,
        embed: {
          type: 'rich',
          title: 'Muted',
          description: `Hey! You've been muted in ${guildinfo.name}.`,
          color: 0xd35269,
          fields: [
            {
              name: 'Reason',
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
    }

    await lib.discord.channels['@0.1.1'].messages.create({
      channel_id: `${logchannel}`,
      content: '**Moderation Logs |** Mute',
      tts: false,
      embed: {
        type: 'rich',
        title: 'Mute',
        description: `A user was muted in ${guildinfo.name} for a week!`,
        color: 0xd35269,
        fields: [
          {
            name: 'User | 👤',
            value: `<@!${userId}> (${userId})`,
          },
          {
            name: 'Reason | ❓',
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
    // apply time out
    await lib.discord.guilds['@0.2.2'].members.timeout.update({
      user_id: `${userID}`,
      guild_id: `${context.params.event.guild_id}`,
      communication_disabled_until_seconds: 604800,
      reason: `${reason}`,
    });
    // send message in current channel
    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `**User Muted** - ${reason}`,
      tts: false,
    });
    // set next case number
    let newcasenumber = await lib.utils.kv['@0.1.16'].set({
      key: `${context.params.event.guild_id}_casenumber`,
      value: ++casenumber,
    });
  } else {
    // role of user higher than role of moderator
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You are unable to mute a user that is higher in the role hierarchy than you.`,
    });
  }
} else {
  // user does not have staffrole
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have the correct permissions for /mute, <@!${context.params.event.member.user.id}>. You need the <@&${staffrole}> role.`,
  });
}
