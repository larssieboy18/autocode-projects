// set some info
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
// set date
MediaPlayPause
var unixTime = Math.round(new Date(`${now}`).getTime() / 1000);
// check if user has permission
if (
  context.params.event.member.roles.includes(staffrole) ||
  context.params.event.member.permission_names.includes(`BAN_MEMBERS`) ||
  context.params.event.member.permission_names.includes(`ADMINISTRATOR`)
) {
  // set values
  let userId = context.params.event.data.options[0].value;
  let reason = context.params.event.data.options[1].value;
  let banneduserinfo = await lib.discord.guilds['@0.1.3'].members.retrieve({
    user_id: `${context.params.event.data.options[0].value}`,
    guild_id: `${context.params.event.guild_id}`,
  });

  let modinfo = await lib.discord.guilds['@0.1.3'].members.retrieve({
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // check position mod & user
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
    .then((roles) => roles.find((x) => x.id === `${banneduserinfo.roles[0]}`));
  if (!banneduserinfo.roles[0]) {
    var positionuser = {position: 0};
  }
  // if position mod is lower, do not let them ban the user
  if (positionmod.position > positionuser.position) {
    try {
      // send DM
      await lib.discord.users['@0.1.1'].dms.create({
        recipient_id: `${userId}`,
        content: `**${process.env.SERVERNAME} Alert**`,
        tts: false,
        embed: {
          type: 'rich',
          title: 'Banned',
          description: `You've been banned in ${guildinfo.name}.`,
          color: 0xcc2936,
          fields: [
            {
              name: 'Reason',
              value: reason,
            },
          ],
        },
      });
    } catch (error) {
      // if DM's are blocked, do not send a DM and let the mod know :)
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: 'Unable to send user a DM. No DM has been send',
      });
      console.error(error);
    }
    // actually ban the user
    let createban = await lib.discord.guilds['@0.1.0'].bans.create({
      user_id: `${userId}`,
      guild_id: `${context.params.event.guild_id}`,
      reason: `${reason} - Banned by ${modinfo.user.username}#${modinfo.user.discriminator}`,
      delete_message_days: 1,
    });

    // // create log message
    // await lib.discord.channels['@0.1.1'].messages.create({
    // channel_id: `${logchannel}`,
    // content: '**Moderation Logs |** Ban',
    // tts: false,
    // embed: {
    // type: 'rich',
    // title: 'Ban',
    // description: `A user was banned in ${guildinfo.name}!`,
    // color: 0xcc2936,
    // fields: [
    // {
    // name: 'User | 👤',
    // value: `<@!${userId}> (${userId})`,
    // },
    // {
    // name: 'Reason | ❓',
    // value: `${reason}`,
    // },
    // {
    // name: 'Moderator | 🔒',
    // value: `<@!${context.params.event.member.user.id}>`,
    // },
    // {
    // name: 'Time | ⏱️',
    // value: `<t:${unixTime}>`,
    // },
    // ],
    // },
    // });

    // create message in chat
    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `**User Banned** - ${reason}`,
      tts: false,
    });
  } else {
    // error message: role hierarchy
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You are unable to ban a user that is higher in the role hierarchy than you.`,
    });
  }
} else {
  // error message: insufficient permissions
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have the correct permissions for /ban, <@!${context.params.event.member.user.id}>. You need the <@&${staffrole} role.`,
  });
}
