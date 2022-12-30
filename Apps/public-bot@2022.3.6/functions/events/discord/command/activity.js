const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const activity_options = {
  youtube: '755600276941176913',
  poker: '755827207812677713',
  chess: '832012774040141894',
  betrayal: '773336526917861400',
  fishing: '814288819477020702',
};

// get activity channel
var activitychannel = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_activitychannel`,
});

if (context.params.event.data.options[0].name == `start`) {
  // if no activity channel has been set
  if (!activitychannel) {
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `An activity channel has not been setup yet. Please run \`/activity set <channel>\` to set your activity channel.`,
    });
  } else {
    // if one has been set, keep going
    let selected_activity =
      activity_options[
        `${context.params.event.data.options[0].options[0].value}`
      ];
    let invite = await lib.discord.invites['@0.1.0'].create({
      channel_id: `${activitychannel}`,
      max_age: 86400,
      max_uses: 0,
      temporary: false,
      unique: false,
      target_type: 'EMBEDDED_APPLICATION',
      target_application_id: `${selected_activity}`,
    });
    var unixtime = Math.round(
      new Date(`${invite.expires_at}`).getTime() / 1000
    );
    await lib.discord.interactions['@1.0.1'].responses.create({
      token: `${context.params.event.token}`,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
      content: ``,
      embeds: [
        {
          type: 'rich',
          title: ``,
          description: `Click [here](https://discord.com/invite/${invite.code}) to start!`,
          color: 0x00ff04,
          thumbnail: {
            url: `https://cdn.discordapp.com/app-icons/${invite.target_application.id}/${invite.target_application.icon}.png`,
            height: 0,
            width: 0,
          },
          fields: [
            {
              name: `Invite expires`,
              value: `<t:${unixtime}:R>`,
              inline: true,
            },
          ],
        },
      ],
    });
  }
}
