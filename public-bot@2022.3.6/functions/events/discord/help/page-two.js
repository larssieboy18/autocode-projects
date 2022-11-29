const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@0.1.0'].followups.update({
  token: `${context.params.event.token}`,
  message_id: `${context.params.event.message.id}`,
  content: '',
  tts: false,
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
      title: `Help menu [2]`,
      description: `The following commands can only be used by staff members:`,
      color: context.params.event.message.embeds[0].color,
      fields: [
        {
          name: `/ban`,
          value: `Ban a user from the server.`,
          inline: true,
        },
        {
          name: `/mute`,
          value: `Mute a user in the server.`,
          inline: true,
        },
        {
          name: `/unban`,
          value: `Unban a user from the server.`,
          inline: true,
        },
        {
          name: `/unmute`,
          value: `Unmute a user in the server`,
          inline: true,
        },
        {
          name: `/warn`,
          value: `Warn a user in the server.`,
          inline: true,
        },
      ],
    },
  ],
});
