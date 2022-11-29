// set variables
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let channel = context.params.event.data.options[0].value;
let member = context.params.event.member;
let userID = member.user.id;

// get info about whether or not this prompt has already been created
let alreadydone = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_pronounsprompt`,
});

// get info about channel
let channelinfo = await lib.discord.channels['@0.3.0'].retrieve({
  channel_id: channel,
});

if (
  // make sure only admins can run this command
  member.permission_names.includes(`MANAGE_GUILD`) ||
  member.permission_names.includes(`ADMINISTRATOR`)
) {
  if (alreadydone == `true`) {
    // confirmation message when the prompt has already been created before
    await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: '',
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              style: 4,
              label: `Reset`,
              custom_id: `reset_pronoun_prompt`,
              disabled: false,
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          type: 'rich',
          title: `Are you sure you want to recreate the prompt? `,
          description: `If so, please click the button below and run the command again. This will also remove the previously created roles and therefore remove them from all members.`,
          color: 0x00ffff,
        },
      ],
    });
  } else {
    if (channelinfo.type == `0`) {
      // make sure the channel is a text channel
      try {
        // create roles and set kv values for them
        let hehimrole = await lib.discord.guilds['@0.2.2'].roles.create({
          guild_id: `${context.params.event.guild_id}`,
          name: `He/Him`,
          permissions: `0`,
          hoist: false,
          mentionable: false,
        });
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_hehim`,
          value: hehimrole.id,
        });
        let sheherrole = await lib.discord.guilds['@0.2.2'].roles.create({
          guild_id: `${context.params.event.guild_id}`,
          name: `She/Her`,
          permissions: `0`,
          hoist: false,
          mentionable: false,
        });
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_sheher`,
          value: sheherrole.id,
        });
        let theythemrole = await lib.discord.guilds['@0.2.2'].roles.create({
          guild_id: `${context.params.event.guild_id}`,
          name: `They/Them`,
          permissions: `0`,
          hoist: false,
          mentionable: false,
        });
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_theythem`,
          value: theythemrole.id,
        });
        let anypronounrole = await lib.discord.guilds['@0.2.2'].roles.create({
          guild_id: `${context.params.event.guild_id}`,
          name: `Any pronouns`,
          permissions: `0`,
          hoist: false,
          mentionable: false,
        });
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_any`,
          value: anypronounrole.id,
        });
        let askpronounrole = await lib.discord.guilds['@0.2.2'].roles.create({
          guild_id: `${context.params.event.guild_id}`,
          name: `Ask for pronouns`,
          permissions: `0`,
          hoist: false,
          mentionable: false,
        });
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_ask`,
          value: askpronounrole.id,
        });
      } catch (error) {
        console.error(error);
        await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
          token: `${context.params.event.token}`,
          content: `There was an error creating the roles. Please check the logs to see what it was. After fixing the error, run the command again.`,
        });
      }
      await lib.discord.channels['@0.2.0'].messages.create({
        // create prompt
        channel_id: channel,
        content: '',
        tts: false,
        components: [
          {
            type: 1,
            components: [
              {
                style: 1,
                label: `They/Them`,
                custom_id: `theythem`,
                disabled: false,
                emoji: {
                  id: null,
                  name: `🏳️‍🌈`,
                },
                type: 2,
              },
              {
                style: 1,
                label: `She/Her`,
                custom_id: `sheher`,
                disabled: false,
                emoji: {
                  id: null,
                  name: `♀`,
                },
                type: 2,
              },
              {
                style: 1,
                label: `He/him`,
                custom_id: `hehim`,
                disabled: false,
                emoji: {
                  id: null,
                  name: `♂`,
                },
                type: 2,
              },
            ],
          },
          {
            type: 1,
            components: [
              {
                style: 2,
                label: `Any`,
                custom_id: `anypronouns`,
                disabled: false,
                type: 2,
              },
              {
                style: 2,
                label: `Ask me`,
                custom_id: `askpronouns`,
                disabled: false,
                type: 2,
              },
              {
                style: 2,
                label: `Pick Multiple`,
                custom_id: `multiplepronouns`,
                disabled: false,
                type: 2,
              },
            ],
          },
        ],
        embeds: [
          {
            type: 'rich',
            title: `👋 Hey there! What are your pronouns?`,
            description: `Use the buttons below to select what pronouns you'd like us to display for you.`,
            color: 0x7289da,
          },
        ],
      });
      await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_pronounsprompt`,
        value: `true`,
      });
    } else {
      // error message if the user used something else than a text channel
      await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `This command only works with text channels. Please try again and provide a text channel.`,
      });
    }
  }
} else {
  // error message if the user does not have sufficient permissions
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Insufficient permissions. This command can only be ran by an admin of the server.`,
  });
}
