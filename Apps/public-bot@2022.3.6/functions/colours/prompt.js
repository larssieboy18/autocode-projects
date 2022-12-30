const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let staffrole = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_staffrole`,
});
let guildinfo = await lib.discord.guilds['@0.1.2'].retrieve({
  guild_id: `${context.params.event.guild_id}`,
  with_counts: false,
});

if (context.params.event.member.roles.includes(staffrole)) {
  let channelinfo = await lib.discord.channels['@0.2.2'].retrieve({
    channel_id: context.params.event.data.options[0].options[0].value,
  });
  // check if input is text channel
  if (channelinfo.type == 0) {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: '',
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              custom_id: `colours`,
              placeholder: `Select your colour`,
              options: [
                {
                  label: `None`,
                  value: `clear`,
                  description: `Clear your coloured role`,
                  emoji: {
                    id: null,
                    name: `❌`,
                  },
                  default: false,
                },
                {
                  label: `Aqua`,
                  value: `aqua`,
                  emoji: {
                    id: `948630312345292932`,
                    name: `Aqua`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Blue`,
                  value: `blue`,
                  emoji: {
                    id: `948630365361303625`,
                    name: `Blue`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Fuchsia`,
                  value: `fuchsia`,
                  emoji: {
                    id: `948630383514226768`,
                    name: `Fuchsia`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Green`,
                  value: `green`,
                  emoji: {
                    id: `948630410307465247`,
                    name: `Green`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Lime`,
                  value: `lime`,
                  emoji: {
                    id: `948630437264240690`,
                    name: `Lime`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Navy`,
                  value: `navy`,
                  emoji: {
                    id: `948630463977766913`,
                    name: `Navy`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Purple`,
                  value: `purple`,
                  emoji: {
                    id: `948630489206489108`,
                    name: `Purple`,
                    animated: false,
                  },
                  default: false,
                },
                {
                  label: `Red`,
                  value: `red`,
                  emoji: {
                    id: `948630504226295898`,
                    name: `Red`,
                    animated: false,
                  },
                  default: false,
                },
              ],
              min_values: 1,
              max_values: 1,
              type: 3,
            },
          ],
        },
      ],
      embeds: [
        {
          type: 'rich',
          title: `Select your colour`,
          description: `Select the colour you want!`,
          color: 0x00e9fa,
        },
      ],
    });

    try {
      let aqua = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Aqua`,
        permissions: `0`,
        color: 65535,
        hoist: false,
        mentionable: false,
      });
      let aquarole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_aqua`,
        value: `${aqua.id}`,
      });
      let blue = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Blue`,
        permissions: `0`,
        color: 255,
        hoist: false,
        mentionable: false,
      });
      let bluerole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_blue`,
        value: `${blue.id}`,
      });
      let fuchsia = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Fuchsia`,
        permissions: `0`,
        color: 16711935,
        hoist: false,
        mentionable: false,
      });
      let fuchsiarole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_fuchsia`,
        value: `${fuchsia.id}`,
      });
      let green = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Green`,
        permissions: `0`,
        color: 32768,
        hoist: false,
        mentionable: false,
      });
      let greenrole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_green`,
        value: `${green.id}`,
      });
      let lime = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Lime`,
        permissions: `0`,
        color: 65280,
        hoist: false,
        mentionable: false,
      });
      let limerole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_lime`,
        value: `${lime.id}`,
      });
      let navy = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Navy`,
        permissions: `0`,
        color: 128,
        hoist: false,
        mentionable: false,
      });
      let navyrole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_navy`,
        value: `${navy.id}`,
      });
      let purple = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Purple`,
        permissions: `0`,
        color: 8388736,
        hoist: false,
        mentionable: false,
      });
      let purplerole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_purple`,
        value: `${purple.id}`,
      });
      let red = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Red`,
        permissions: `0`,
        color: 16711680,
        hoist: false,
        mentionable: false,
      });
      let redrole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_red`,
        value: `${red.id}`,
      });
      let yellow = await lib.discord.guilds['@0.1.3'].roles.create({
        guild_id: context.params.event.guild_id,
        name: `Yellow`,
        permissions: `0`,
        color: 16776960,
        hoist: false,
        mentionable: false,
      });
      let yellowrole = await lib.utils.kv['@0.1.16'].set({
        key: `${context.params.event.guild_id}_yellow`,
        value: `${yellow.id}`,
      });
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Your prompt and roles have succesfully been created.`,
      });
    } catch (rolesError) {
      console.error(`${context.params.event.guild_id} - ${rolesError}`);
      await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `The prompt was succesfully created, but one or more roles could not be created. Please try running the setup again or report this issue in the NADB's support server: https://discord.gg/kuj6UTPtBQ`,
      });
    }
  } else {
    console.error(`Invalid channel type`);
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `This command only supports text channels. Please make sure that the channel you chose is a text channel.`,
    });
  }
} else {
  // you dont have a staffrole :o
  console.error(`no staff role`);
}
