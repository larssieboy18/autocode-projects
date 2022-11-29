// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = {
  fail: async (user, guild, token) => {
    if (process.env.freeze > 0) {
      // check whether or not the user is already frozen
      let userFrozen = lib.utils.kv['@0.1.16'].get({
        key: `${user}_${guild}_nexttry`,
      });
      let currentTime = Math.floor(Date.now() / 1000);

      // only execute if the user is not already frozen
      if (currentTime > userFrozen) {
        // set the necessary variables for the "freezing". These numbers represent a unix timestamp, you read more about that here:
        let addFreeze = process.env.freeze * 60;
        var nextTry = Math.floor((Date.now() + addFreeze * 1000) / 1000);

        // save the time when the user can try again
        await lib.utils.kv['@0.1.16'].set({
          key: `${user}_${guild}_nexttry`,
          value: nextTry,
          ttl: addFreeze,
        });

        // send an error message if a user presses a red button.
        await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
          token: `${token}`,
          content: `Hi there, you tried verifying, but pressed the wrong button. Please make sure you only click the green button to get access to the server. \nYou can try again <t:${nextTry}:R>.`,
        });
      } else {
        // if the user is frozen, send a different error message
        await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
          token: `${token}`,
          content: `You are currently unable to verify, because you pressed the wrong button before. You can verify again <t:${userFrozen}:R>.`,
        });
      }
    } else {
      // send an error message if a user presses a red button and freeze is disabled
      await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
        token: `${token}`,
        content: `Hi there, you tried verifying, but pressed the wrong button. \nPlease make sure you only click the green button to get access to the server.`,
      });
    }
  },
};
