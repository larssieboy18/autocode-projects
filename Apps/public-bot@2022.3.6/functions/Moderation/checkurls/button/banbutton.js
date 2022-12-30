const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let staffrole = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_staffrole`,
});
let logchannel = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_logchannel`,
});

// Only execute if the user is staff
if (context.params.event.member.roles.includes(staffrole)) {
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
  if (userinfo.roles.includes(staffrole)) {
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You are not allowed to ban a fellow staff member. Please inform the owner that a staff member's account has been compromised.`,
    });
  } else {
    // ban user
    try {
      await lib.discord.guilds['@0.1.0'].bans.create({
        user_id: `${banneduser}`,
        guild_id: `${context.params.event.guild_id}`,
        delete_message_days: 1,
        reason: `Sending suspicious links, confirmed by ${context.params.event.member.user.username}`,
      });
    } catch (error) {
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Unable to ban the user. They probably left the server or another staff member has already banned them`,
      });
      console.error(`The following error occured banning the user: ${error}`);
    }
    // remove buttons if user is banned but keep embed the same --> TODO: keep buttons but set them to disabled
    await lib.discord.channels['@0.2.2'].messages.update({
      message_id: `${context.params.event.message.id}`,
      channel_id: `${context.params.event.channel_id}`,
      content: `${result.content}`,
      embeds: [
        {
          type: `${context.params.event.message.embeds[0].type}`,
          title: `${context.params.event.message.embeds[0].title}`,
          description: `User has been banned by <@${context.params.event.member.user.id}>`,
          color: `${context.params.event.message.embeds[0].color}`,
          fields: context.params.event.message.embeds[0].fields,
          // [
          // {
          // name: `${context.params.event.message.embeds[0].fields[0].name}`,
          // value: `${context.params.event.message.embeds[0].fields[0].value}`,
          // inline: false,
          // },
          // {
          // name: `${context.params.event.message.embeds[0].fields[1].name}`,
          // value: `${context.params.event.message.embeds[0].fields[1].value}`,
          // inline: true,
          // },
          // {
          // name: `${context.params.event.message.embeds[0].fields[2].name}`,
          // value: `${context.params.event.message.embeds[0].fields[2].value}`,
          // inline: true,
          // },
          // {
          // name: `${context.params.event.message.embeds[0].fields[3].name}`,
          // value: `${context.params.event.message.embeds[0].fields[3].value}`,
          // inline: true,
          // },
          // {
          // name: `${context.params.event.message.embeds[0].fields[4].name}`,
          // value: `${context.params.event.message.embeds[0].fields[4].value}`,
          // inline: true,
          // },
          // {
          // name: `${context.params.event.message.embeds[0].fields[5].name}`,
          // value: `${context.params.event.message.embeds[0].fields[5].value}`,
          // inline: false,
          // },
          // ],
          footer: {
            text: `${context.params.event.message.embeds[0].footer.text}`,
            icon_url: `${context.params.event.message.embeds[0].footer.icon_url}`,
            proxy_icon_url: `${context.params.event.message.embeds[0].footer.proxy_icon_url}`,
          },
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              style: 4,
              label: `Ban ${userinfo.user.username}`,
              custom_id: `ban_link_sender`,
              disabled: true,
              emoji: {
                id: `889584957415100417`,
                name: `BanPLS`,
                animated: false,
              },
              type: 2,
            },
            {
              style: 3,
              label: `Unmute ${userinfo.user.username}`,
              custom_id: `unmute_link_sender`,
              disabled: true,
              emoji: {
                id: `895041699699642430`,
                name: `unmute`,
                animated: false,
              },
              type: 2,
            },
          ],
        },
      ],
    });
  }
}
