const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

try {
  if (
    context.params.event.member.user.id == `119473151913623552` &&
    context.params.event.guild_id == `655499718192922644` // Lonely Lars
  ) {
    await lib.discord.commands['@0.0.0'].create({
      name: 'advancement',
      description:
        'Create your own image using the Minecraft advancement template',
      options: [
        {
          type: 3,
          name: 'block-type',
          description:
            'The type of block that should be displayed. Valid blocks can be found https://go.creeper.town/blocks',
          required: true,
        },
        {
          type: 3,
          name: 'title',
          description: 'The title of the advancement',
          required: true,
        },
        {
          type: 3,
          name: 'line1',
          description: 'The first line of text (max. 25 characters)',
          required: true,
        },
        {
          type: 3,
          name: 'line2',
          description: 'The second line of text (max. 25 characters)',
        },
      ],
    });

    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `Done :)`,
    });
  } else {
    await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You're not Lars :eyes:`,
    });
  }
} catch (error) {
  console.error(error);
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Error occured while creating the command! **Error:** ${error}`,
  });
}
