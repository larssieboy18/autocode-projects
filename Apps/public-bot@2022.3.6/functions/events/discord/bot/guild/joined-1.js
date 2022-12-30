// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const channelLogID = `913354310430130186`; //Channel ID where you want to send it
const IconURL = `https://cdn.discordapp.com/icons/${context.params.event.id}/${context.params.event.icon}.png`; //get guild icon url
try {
  let added_by = await lib.discord.guilds['@0.2.2'].auditLogs.list({
    guild_id: context.params.event.id,
    action_type: 28,
  }); //get info from audit log
  let added_by_user = await lib.discord.users['@0.1.6'].retrieve({
    user_id: `${added_by.audit_log_entries[0].user_id}`,
  }); //get info of the user who added the bot
  await lib.discord.channels['@0.3.0'].messages.create({
    //create a message
    channel_id: `${channelLogID}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `New Guild Joined`,
        description: ``,
        fields: [
          {
            name: `GuildName`,
            value: `${context.params.event.name} (ID: \`${context.params.event.id}\`)`, //guild name
          },
          {
            name: `Membercount`,
            value: `${context.params.event.member_count}`,
          },
          {
            name: `Added By`,
            value: `Name: ${added_by_user.username}#${added_by_user.discriminator}\nID: ${added_by.audit_log_entries[0].user_id}\n<@${added_by.audit_log_entries[0].user_id}>`, //name and stuff of the user who added it
          },
        ],
        thumbnail: {
          url: `${IconURL}`, //guild icon
          height: 0,
          width: 0,
        },
      },
    ],
  });
} catch (e) {
  //if there is an error
  await lib.discord.channels['@0.2.0'].messages.create({
    //create a message
    channel_id: `${channelLogID}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Bot joined a new Guild`,
        description: ``,
        fields: [
          {
            name: `GuildName`,
            value: `${context.params.event.name}`, //Guild name
          },
          {
            name: `Added By`,
            value: `**There was an Error Retrieving who Invited the Bot. Check Logs for more info.**`,
          },
        ],
        thumbnail: {
          url: `${IconURL}`, //Guild icon url
          height: 0,
          width: 0,
        },
      },
    ],
  });
}
