/*
This file is the main thing. It creates everything, the role, the channel and the prompt. If any issues arise in the logs,
be sure to send @Lars.#0018 a message in the Autocode Discord server, as that is not supposed to happen :)
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// lists the permissions that the user running the command has
let permissiondata = context.params.event.member.permission_names;

// we need to make sure that only admins of the server can run this command. This if statement makes sure only people with MANAGE SERVER or ADMIN permissions can run it
if (
  permissiondata.includes('MANAGE_GUILD') ||
  permissiondata.includes('ADMINISTRATOR')
) {
  // this gets a list (in array format) of all channels in the guild that the command was run in.
  let channels = await lib.discord.guilds['@0.2.2'].channels.list({
    guild_id: `${context.params.event.guild_id}`,
  });

  // this gets some information about the guild the command is run in.
  let guildinfo = await lib.discord.guilds['@0.2.2'].retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });

  // to make sure there is only 1 verification channel, we check every channel to see if there already is a channel named verification.
  // if that is the case, the bot will send an error message and ask you if you want to continue or not. This is handled in a different file.
  let verificationChannel = channels.find(
    (channels) => channels.name == 'verification'
  );
  if (verificationChannel) {
    return await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `A verification channel already exists. Are you sure you want to continue with creating a channel and role?`,
      components: [
        {
          type: 1,
          components: [
            {
              style: 3,
              label: `Continue anyways`,
              custom_id: `verification_continue`,
              disabled: false,
              emoji: {
                id: `818439292430581781`,
                name: `acheck`,
                animated: true,
              },
              type: 2,
            },
            {
              style: 4,
              label: `Don't continue`,
              custom_id: `verification_stop`,
              disabled: false,
              emoji: {
                id: `818439378434785290`,
                name: `across`,
                animated: true,
              },
              type: 2,
            },
          ],
        },
      ],
    });
  }

  // we need a role to give to people if they have not been verified yet. This role is created here.
  let verifyrole = await lib.discord.guilds['@0.2.2'].roles.create({
    guild_id: `${context.params.event.guild_id}`,
    name: `Needs to verify`,
    permissions: `0`,
    hoist: false,
    mentionable: false,
  });

  // to make sure we can use the ID of the role in different files, we store the ID of the role in a key-value (kv) pair
  await lib.utils.kv['@0.1.16'].set({
    key: `${context.params.event.guild_id}_nonverifiedrole`,
    value: `${verifyrole.id}`,
  });

  // this just shows you more info about the verify role in the logs. Very useful for debugging.
  console.log(`Info about the verification role:`);
  console.log(verifyrole);

  // what good would the verification system be if people could just access all channels? This loop goes through all channels
  // and makes sure the "Needs to verify" role (created above) does not have access to the channels.
  for (let z = 0; z < channels.length; z++) {
    let channeloverwrite = await lib.discord.channels[
      '@0.3.0'
    ].permissions.update({
      overwrite_id: `${verifyrole.id}`,
      channel_id: `${channels[z].id}`,
      deny: `1024`,
      type: 0,
    });
  }

  // this creates the verification channel. No one apart from people with the "Needs to verify" role (created above) and admins have access to it.
  let verifychannel = await lib.discord.guilds['@0.2.2'].channels.create({
    guild_id: `${context.params.event.guild_id}`,
    name: `verification`,
    type: 0,
    topic: `Click the green button to be let in to the server.`,
    permission_overwrites: [
      {
        id: `${verifyrole.id}`,
        type: 0,
        allow: 66560,
      },
      {
        id: `${context.params.event.guild_id}`,
        type: 0,
        deny: 377957125184,
      },
      // if you want staff members to also have access to the channel, uncomment the following section and replace STAFFROLE_ID_HERE with the ID of your staff's role
      // {
      // id: `STAFFROLE_ID_HERE`,
      // type: 0,
      // allow: 66560,
      // },
    ],
  });

  // move the verification channel to the top of the server so everyone can find it better
  await lib.discord.guilds['@0.2.2'].channels.update({
    guild_id: `${context.params.event.guild_id}`,
    id: `${verifychannel.id}`,
    position: 0,
  });

  // to make sure we can use the ID of the channel in different files, we store the ID of the channel in a key-value (kv) pair
  await lib.utils.kv['@0.1.16'].set({
    key: `${context.params.event.guild_id}_verificationchannel`,
    value: `${verifychannel.id}`,
  });

  // this just shows you more info about the verification channel in the logs. Very useful for debugging.
  console.log(`Info about the verification channel:`);
  console.log(verifychannel);

  // last but not least, we create the message and buttons that people have to interact with to be verified
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${verifychannel.id}`,
    content: '',
    tts: false,
    embeds: [
      {
        type: 'rich',
        title: `Verification`,
        description: `Hi there, welcome to ${guildinfo.name}!\n\nTo get access to everything our server has to offer, we want to make sure you are not a bot. Click the green button below to get let into the server.\n\nIf you encounter any errors, please contact the server owner: <@${guildinfo.owner_id}>`,
        color: 0x00ffff,
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            style: 4,
            label: `Wrong button`,
            custom_id: `verification_fail_v1`,
            disabled: false,
            type: 2,
          },
          {
            style: 4,
            label: `Not this one`,
            custom_id: `verification_fail_v2`,
            disabled: false,
            type: 2,
          },
          {
            style: 3,
            label: `Click this button`,
            custom_id: `verification_success`,
            disabled: false,
            type: 2,
          },
          {
            style: 4,
            label: `Wrong button`,
            custom_id: `verification_fail_v3`,
            disabled: false,
            type: 2,
          },
        ],
      },
      {
        type: 1,
        components: [
          {
            style: 2,
            label: `Welcome to ${guildinfo.name}`,
            custom_id: `if_you_can_click_this_you_must_be_pretty_awesome`,
            disabled: true,
            type: 2,
          },
        ],
      },
    ],
  });
} else {
  // if someone does not have sufficient permissions, it will give them an error message.
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You do not have sufficient permissions to run this command. Please consult an admin of the server if you believe this is an error.`,
  });
}
