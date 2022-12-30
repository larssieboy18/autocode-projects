const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// need to build in error handling & why tom's and mine dont work but wall's does
const args = context.params.event.data.options[0].value;
let info = await lib.http.request['@1.1.5'].get({
  url: `https://api.mojang.com/users/profiles/minecraft/${args}`,
});
let nameh = await lib.http.request['@1.1.5'].get({
  url: `https://some-random-api.ml/mc?username=${args}`,
});
await lib.discord.interactions['@1.0.1'].responses.create({
  token: `${context.params.event.token}`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: '',
  tts: false,
  embed: {
    type: 'rich',
    title: `${nameh.data.username}`,
    description: '',
    color: 0xb67afb,
    fields: [
      {
        name: `UUID`,
        value: `${info.data.id}`,
      },
      {
        name: `Skin`,
        value: `[Click here](https://crafatar.com/skins/${info.data.id})`,
      },
    ],
    image: {
      url: `https://crafatar.com/renders/body/${info.data.id}?size=4&default=MHF_Steve&overlay`,
      height: 0,
      width: 0,
    },
    thumbnail: {
      url: `
      https://crafatar.com/renders/head/${info.data.id}`,
      height: 0,
      width: 0,
    },
    author: {
      name: `Minecraft Userinfo`,
    },
  },
});
