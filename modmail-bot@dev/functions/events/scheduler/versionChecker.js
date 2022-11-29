// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// set variables
let currentVersion = `1.0.8`;
let guild = process.env.guildID;

// check if a new version has been released
let versionCheck = await lib.chillihero.autocode['@0.0.4'].version.check({
  username: `creepertown`,
  appname: `modmail-bot`,
  currentVersion: `${currentVersion}`,
  updateNotes: false,
});

// check if you have already been notified about an update being required
let updateRequired = await lib.utils.kv['@0.1.16'].get({
  key: `${guild}_modmail_updateRequired`,
  defaultValue: false,
});

if (versionCheck.updateNeeded == true) {
  // set kv-pair to prevent you from being spammed inside discord
  await lib.utils.kv['@0.1.16'].set({
    key: `${guild}_modmail_updateRequired`,
    value: versionCheck.updateNeeded,
    ttl: 172800
  });
  // send a message in the console with the
  console.log(
    `New version available! Please make sure to update to version ${versionCheck.newestVersion}. \nSupport is only provided for the latest version.` +
      `\n` +
      `BE AWARE THAT ANY CHANGES YOU HAVE MADE YOURSELF WILL BE RESET AFTER UPDATING. \nMAKE SURE TO BACK THEM UP!`
  );

  // if no message has been sent to Discord yet, send one in the logs channel.
  if (updateRequired == false) {
    // get the ID of the logchannel
    let logchannel = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_logchannel`,
    });
    // send the message to Discord
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${logchannel}`,
      content: '',
      tts: false,
      embeds: [
        {
          type: 'rich',
          title: `The modmail app has received a new update`,
          description: `You are not using the latest version of modmail. Support is only provided for the latest version. Please ask the bot owner to update the app`,
          color: 0x00ffff,
          fields: [
            {
              name: `Your version`,
              value: `${currentVersion}`,
              inline: true,
            },
            {
              name: `Newest version`,
              value: `${versionCheck.newestVersion}`,
              inline: true,
            },
          ],
        },
      ],
    });
  } else {
    console.log(
      `A message notifying you about the new update has already been sent inside Discord. No need to do that again :)`
    );
  }
} // if you are using the newest version, send a congrats message in the console :)
else if (currentVersion == versionCheck.newestVersion) {
  await lib.utils.kv['@0.1.16'].clear({
    key: `${guild}_modmail_updateRequired`,
  });
  console.log(`You are using the newest version. Thanks for updating!`);
}
