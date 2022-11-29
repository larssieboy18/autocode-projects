const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let selectedcolour = context.params.event.data.values[0];

let aqua = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_aqua`,
});
let blue = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_blue`,
});
let fuchsia = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_fuchsia`,
});
let green = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_green`,
});
let lime = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_lime`,
});
let navy = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_navy`,
});
let purple = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_purple`,
});
let red = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.guild_id}_red`,
});

// remove all coloured roles
try {
  const roleIds = [aqua, blue, fuchsia, green, lime, navy, purple, red];
  for (let roleId of roleIds) {
    await lib.discord.guilds['@0.1.3'].members.roles.destroy({
      role_id: roleId,
      user_id: context.params.event.member.user.id,
      guild_id: context.params.event.guild_id,
    });
  }
} catch (error) {
  console.error(error);
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Please slow down! You will be able to select a new colour in a little bit.`,
  });
}

if (selectedcolour == `clear`) {
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully removed your coloured role!`,
  });
} else if (selectedcolour == `aqua`) {
  // apply aqua role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${aqua}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `blue`) {
  // apply blue role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${blue}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `fuchsia`) {
  // apply fuchsia role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${fuchsia}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `green`) {
  // apply green role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${green}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `lime`) {
  // apply lime role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${lime}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `navy`) {
  // apply navy role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${navy}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `purple`) {
  // apply purple role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${purple}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
} else if (selectedcolour == `red`) {
  // apply red role
  await lib.discord.guilds['@0.1.3'].members.roles.update({
    role_id: `${red}`,
    user_id: `${context.params.event.member.user.id}`,
    guild_id: `${context.params.event.guild_id}`,
  });
  // post succes message
  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Succesfully applied the ${selectedcolour} role!`,
  });
}
