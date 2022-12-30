// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// sets variables
let {guild_id, data, token} = context.params.event;
let input = data.options[0].value;

// get the data from the database about the user
let userdata = await lib.utils.kv['@0.1.16'].get({
  key: `${input}_${guild_id}_voiceState`,
});

console.log(userdata);

// if there is data found, send it in the channel
if (userdata) {
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: '',
    embeds: [
      {
        type: 'rich',
        title: `VC status for ${userdata.username}`,
        description: '',
        color: 0x2f3136, //0x2b5a1a,
        fields: [
          {
            name: `Voice Channel`,
            value: `<#${userdata.channel_id}>`,
            inline: true,
          },
          {
            name: `Joined VC`,
            value: `<t:${Math.floor(userdata.timestamp_join / 1000)}:R>`,
            inline: true,
          },
          {
            name: `Last change`,
            value: `<t:${Math.floor(userdata.last_change / 1000)}:R>`,
            inline: true,
          },
          {
            name: `Muted`,
            value: `\`\`\`js\n${userdata.self_mute}\`\`\``,
            inline: true,
          },
          {
            name: `Deafened`,
            value: `\`\`\`js\n${userdata.self_deaf}\`\`\``,
            inline: true,
          },
          {
            name: `Video on`,
            value: `\`\`\`js\n${userdata.self_video}\`\`\``,
            inline: true,
          },
          {
            name: `Server Muted`,
            value: `\`\`\`js\n${userdata.mute}\`\`\``,
            inline: true,
          },
          {
            name: `Server Deafened`,
            value: `\`\`\`js\n${userdata.deaf}\`\`\``,
            inline: true,
          },
        ],
      },
    ],
  });
  // if there is no userdata, return the message below
} else {
  console.error(`No userdata found in the database for user ${input}`);
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${token}`,
    content: `<@${input}> is not in a voice channel. Try again with a user that is in a voice channel.`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
}
