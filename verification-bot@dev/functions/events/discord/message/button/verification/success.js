// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// check whether or not the user is already frozen
let userFrozen = await lib.utils.kv['@0.1.16'].get({
  key: `${context.params.event.member.user.id}_${context.params.event.guild_id}_nexttry`,
});
let currentTime = Math.floor(Date.now() / 1000);

// only execute if the user is not already frozen
if (currentTime > userFrozen) {
  // get information about the user clicking the button
  let userinfo = context.params.event.member;

  // set some information about the non-verified role and the guild the button is pressed in
  let nonverifiedrole = await lib.utils.kv['@0.1.16'].get({
    key: `${context.params.event.guild_id}_nonverifiedrole`,
  });
  let guildinfo = await lib.discord.guilds['@0.2.2'].retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });

  // we only want non-verified users to be able to press the buttons. The if statement checks if the user has that role or not.
  if (userinfo.roles.includes(nonverifiedrole)) {
    // if the user presses the right button, we want the non-verified role to be removed.
    await lib.discord.guilds['@0.2.2'].members.roles.destroy({
      role_id: `${nonverifiedrole}`,
      user_id: `${context.params.event.member.user.id}`,
      guild_id: `${context.params.event.guild_id}`,
    });

    // if your server has a verified role, make sure to uncomment below and replace VERIFIEDROLE_ID_HERE with the ID of the verified role
    // await lib.discord.guilds['@0.2.2'].members.roles.update({
    // role_id: `VERIFIEDROLE_ID_HERE`,
    // user_id: `${context.params.event.member.user.id}`,
    // guild_id: `${context.params.event.guild_id}`
    // });

    // and when everything has been done, we want to send a success message
    await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You have been succesfully verified in the ${guildinfo.name}! Welcome to the server :tada:`,
    });
  } else {
    // if the user does not have the non-verified role, send an error message that they are already verified
    await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
      token: `${context.params.event.token}`,
      content: `You are already verified! No need to click the button again :)`,
    });
  }
} else {
  // if the user is frozen, send a different error message
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `You are currently unable to verify, because you pressed the wrong button before. You can verify again <t:${userFrozen}:R>.`,
  });
}
