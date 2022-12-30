const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@1.0.1'].followups.create({
  token: `${context.params.event.token}`,
  content: '',
  components: [
    {
      type: 1,
      components: [
        {
          style: 1,
          custom_id: `help-one`,
          disabled: false,
          emoji: {
            id: null,
            name: `1️⃣`,
          },
          type: 2,
        },
        {
          style: 1,
          custom_id: `help-two`,
          disabled: false,
          emoji: {
            id: null,
            name: `2️⃣`,
          },
          type: 2,
        },
      ],
    },
  ],
  embeds: [
    {
      type: 'rich',
      title: `Help menu [1]`,
      description: `Hi there, thanks for using ${process.env.botname}! Here are the commands you can use:`,
      color: 0x00ffff,
      fields: [
        {
          name: `/activity`,
          value: `Creates an invite for the activitychannel that allows you to play certain Discord activities inside the voice channel.`,
          inline: true,
        },
        {
          name: `/advancement`,
          value: `Create a Minecraft-inspired advancement with your own text.`,
          inline: true,
        },
        {
          name: `/botinfo`,
          value: `Get info about NADB.`,
          inline: true,
        },
        {
          name: `/config`,
          value: `Change the settings for this server [admin only]`,
          inline: true,
        },
        {
          name: `/covid`,
          value: `Get information about the Covid-19 pandemic, like infection count, per country.`,
          inline: true,
        },
        {
          name: `/skin`,
          value: `Get someone's Minecraft playerskin.`,
          inline: true,
        },
        {
          name: `/translate`,
          value: `Translate text.`,
          inline: true,
        },
      ],
    },
  ],
});
