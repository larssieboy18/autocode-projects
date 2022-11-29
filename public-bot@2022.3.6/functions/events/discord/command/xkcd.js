const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let currentcomic = await lib.http.request['@1.1.6'].get({
  url: `https://xkcd.com/info.0.json`,
});

// also make a random one

await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${context.params.event.token}`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: '',
  tts: false,
  embeds: [
    {
      type: 'rich',
      title: `${currentcomic.data.safe_title}`,
      description: `${currentcomic.data.alt}`,
      color: 0x00ffff,
      image: {
        url: `${currentcomic.data.img}`,
        height: 0,
        width: 0,
      },
      footer: {
        text: `© xkcd.com`,
        icon_url: `https://xkcd.com/s/0b7742.png`,
        proxy_icon_url: `https://xkcd.com`,
      },
    },
  ],
});
