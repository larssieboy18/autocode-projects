const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let creator = await lib.discord.users['@0.2.0'].retrieve({
  user_id: `119473151913623552`,
});

await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${context.params.event.token}`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: '',
  tts: false,
  embeds: [
    {
      type: 'rich',
      title: `${process.env.botname}'s info`,
      description: `Thanks for using ${process.env.botname}! Here is some info about it :)`,
      color: 0x00ffff,
      thumbnail: {
        url: `https://cdn.discordapp.com/avatars/909192226654015539/c98133efb83ea6f595acd168d48067ef.png`,
        proxy_url: `nadb.xyz`,
        height: 0,
        width: 0,
      },
      fields: [
        {
          name: `Support server`,
          value: `https://discord.gg/kuj6UTPtBQ`,
          inline: false,
        },
        {
          name: `Invite me!`,
          value: `https://l.nadb.xyz/invite`,
          inline: false,
        },
      ],
      footer: {
        text: `Developed by @Lars.#0018`,
        icon_url: creator.avatar_url,
      },
    },
  ],
});
