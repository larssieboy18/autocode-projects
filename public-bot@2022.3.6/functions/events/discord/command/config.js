const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let permissiondata = context.params.event.member.permission_names;
let kindofconfig = context.params.event.data.options[0].name;

// check if user has manage server or admin
if (
  permissiondata.includes('MANAGE_GUILD') ||
  permissiondata.includes('ADMINISTRATOR')
) {
  // view or set or clear? --> set
  if (kindofconfig == `set`) {
    if (
      context.params.event.data.options[0].options[0].name == `activitychannel`
    ) {
      // set activitychannel
      var input =
        context.params.event.data.options[0].options[0].options[0].value;
      let channelinfo = await lib.discord.channels['@0.2.2'].retrieve({
        channel_id: `${input}`,
      });
      // only work with voice channels
      if (channelinfo.type == `2`) {
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_activitychannel`,
          value: input,
        });
        await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
          token: `${context.params.event.token}`,
          content: `Set <#${input}> as the new activity channel!`,
        });
        // error message with reason: invalid channel type
      } else {
        await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
          token: `${context.params.event.token}`,
          content: `<#${input}> is not a valid voice channel. Please try again.`,
        });
      }
      // change logchannel setting
    } else if (
      context.params.event.data.options[0].options[0].name == `logchannel`
    ) {
      var input =
        context.params.event.data.options[0].options[0].options[0].value;
      // get info about input channel
      let channelinfo = await lib.discord.channels['@0.2.2'].retrieve({
        channel_id: `${input}`,
      });
      // only work with text channels
      if (channelinfo.type == 0) {
        // save logchannel
        let logchannel = await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_logchannel`,
          value: input,
        });
        // post succes message
        await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
          token: `${context.params.event.token}`,
          content: `Your logchannel has succesfully been set to <#${input}>`,
        });
      } else {
        // post fail message. reason: invalid channel
        await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
          token: `${context.params.event.token}`,
          content: `This command only accepts text channels. Please choose a different channel. Your logchannel has not been changed.`,
        });
      }
    }
    // set staffrole
    else if (
      // when statrole is changed, switch permissions so only people with staffrole can use /ban etc
      context.params.event.data.options[0].options[0].name == `staffrole`
    ) {
      var input =
        context.params.event.data.options[0].options[0].options[0].value;
      // save staffrole
      let staffrole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_staffrole`,
        value: `${input}`,
      });
      // post success message
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Your staffrole has succesfully been changed to <@&${input}>`,
      });
    }
  }

  // view or set or clear? --> view
  else if (kindofconfig == `view`) {
    let staffroledata = await lib.utils.kv['@0.1.16'].get({
      key: `${context.params.event.guild_id}_staffrole`,
      defaultValue: 69,
    });

    let logchanneldata = await lib.utils.kv['@0.1.16'].get({
      key: `${context.params.event.guild_id}_logchannel`,
      defaultValue: 69,
    });

    let activitychanneldata = await lib.utils.kv['@0.1.16'].get({
      key: `${context.params.event.guild_id}_activitychannel`,
      defaultValue: 69,
    });

    let guildinfo = await lib.discord.guilds['@0.1.2'].retrieve({
      guild_id: `${context.params.event.guild_id}`,
      with_counts: false,
    });

    var staffrole = `<@&${staffroledata}>`;
    var logchannel = `<#${logchanneldata}>`;
    var activitychannel = `<#${activitychanneldata}>`;

    if (staffroledata == 69) {
      var staffrole = `You have not set your staffrole yet. Please be sure to do so by using \`/config set staffrole\``;
    }
    if (logchanneldata == 69) {
      var logchannel = `You have not set your logchannel yet. Please be sure to do so by using \`/config set logchannel\``;
    }
    if (activitychanneldata == 69) {
      var activitychannel = `You have not set your logchannel yet. Please be sure to do so by using \`/config set activitychannel\``;
    }

    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: '',
      tts: false,
      embeds: [
        {
          type: 'rich',
          title: `${guildinfo.name}'s settings`,
          description: '',
          color: 0x0f32dc,
          fields: [
            {
              name: `Logchannel`,
              value: `${logchannel}`,
              inline: true,
            },
            {
              name: `Staffrole`,
              value: `${staffrole}`,
              inline: true,
            },
            {
              name: `Activity channel`,
              value: `${activitychannel}`,
              inline: true,
            },
          ],
          footer: {
            text: `Powered by ${process.env.botname}`,
          },
        },
      ],
    });
  }

  // view or set or clear? --> clear
  else if (kindofconfig == `clear`) {
    if (context.params.event.data.options[0].options[0].name == `staffrole`) {
      await lib.utils.kv['@0.1.16'].clear({
        key: `${context.params.event.guild_id}_staffrole`,
      });
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Succesfully cleared your staffrole!`,
      });
    } else if (
      context.params.event.data.options[0].options[0].name == `logchannel`
    ) {
      await lib.utils.kv['@0.1.16'].clear({
        key: `${context.params.event.guild_id}_logchannel`,
      });
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Succesfully cleared your logchannel!`,
      });
    } else if (
      context.params.event.data.options[0].options[0].name == `activitychannel`
    ) {
      await lib.utils.kv['@0.1.16'].clear({
        key: `${context.params.event.guild_id}_activitychannel`,
      });
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Succesfully cleared your activitychannel!`,
      });
    }
  }
  // insufficient permission message
} else {
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have sufficient permissions to access the config.`,
  });
}
