const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let input = context.params.event.data.options[0].value;

// let result = await lib.http.request['@1.1.6'].get({
// url: `https://api.urbandictionary.com/v0/define?term=${input}`
// });

let UDresult = await lib.http.request['@1.1.6'].get({
  url: `https://api.urbandictionary.com/v0/define`,
  queryParams: {
    term: `${input}`,
  },
});

console.log(UDresult.data.list[0].definition);

let {definition, thumbs_up, thumbs_down} = UDresult.data.list[0]
let currentPage = 1 
let totalPages = 2
// also replace all [ and ] with nothing

await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: '',
  tts: false,
  embeds: [
    {
      type: 'rich',
      title: `Urban Dictionary results for ${input}`,
      description: `Here are your results from Urban Dictionary! Click the arrows below to cycle between them.`,
      color: 0x367120,
      fields: [
        {
          name: `Definition`,
          value: `${definition}`,
        },
        {
          name: `Rating`,
          value: `${thumbs_up} 👍 / ${thumbs_down} 👎`,
          inline: true,
        },
        {
          name: `URL`,
          value: `http://lars.urbanup.com/965214`,
          inline: true,
        },
      ],
      footer: {
        text: `Page ${currentPage}/${totalPages}`,
        icon_url: `https://www.urbandictionary.com/favicon.ico`,
        proxy_icon_url: `https://www.urbandictionary.com/favicon.ico`,
      },
    },
  ],
  components: [
    {
      type: 1,
      components: [
        {
          style: 1,
          custom_id: `UD_previous`,
          disabled: false,
          emoji: {
            id: null,
            name: `⬅`,
          },
          type: 2,
        },
        {
          style: 1,
          custom_id: `UD_next`,
          disabled: false,
          emoji: {
            id: null,
            name: `➡`,
          },
          type: 2,
        },
      ],
    },
  ],
});

/* embed maken
selection menu, eerste 10 letters van resultaat tonen
*/
