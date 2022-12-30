/*
if you want to test and see if the code is working, you can use the following URL: verified.test.phisherman.gg
*/

const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
// all common TLD's are contained inside this regex. If you want to add a TLD, feel free to do so by inserting it between the latest brackets like so: ?(:com|ai|YOUR TLD HERE|art|biz|cloud|ETC...)
var regex =
  /\b(?:https:\/\/|http:\/\/|www\.|)\S+\.(?:com|ai|art|biz|cloud|club|co|click|design|dev|digital|fun|gg|gift|health|info|io|is|live|me|net|nl|online|org|shop|site|space|store|studio|tech|us|website|xyz)\b/i;
var messagecontent = context.params.event.content;
let staffrole = process.env.STAFFROLE;
let logchannel = process.env.LOGCHANNEL;

// set current time for use down the road
const now = new Date();
const unixTime = Math.floor(Date.now() / 1000);

//check if message contains url
if (messagecontent.match(regex)) {
  let urltoscan = messagecontent.match(regex)[0];
  // convert url to domain
  var pointtosliceat = 0;
  if (urltoscan.startsWith('https://')) {
    var pointtosliceat = 8;
  }
  if (urltoscan.startsWith(`http://`)) {
    var pointtosliceat = 7;
  }
  if (urltoscan.startsWith(`https://www.`)) {
    var pointtosliceat = 12;
  }
  if (urltoscan.startsWith(`www.`)) {
    var pointtosliceat = 4;
  }
  let domaintoscan = urltoscan.slice(pointtosliceat);
  console.log(`URL found! Domain: ${domaintoscan}`);

  let scanresult = await lib.http.request['@1.1.6'].get({
    url: `https://api.phisherman.gg/v1/domains/${domaintoscan}`,
    headers: {
      'Content-Type': `application/json`,
    },
  });

  // get info about the guild
  let guildinfo = await lib.discord.guilds['@0.2.2'].retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });

  // check if link is sussy
  if (scanresult.data == true) {
    console.log(
      `sussy link found in ${guildinfo.name} (${context.params.event.guild_id})`
    );
    // delete the sus url
    try {
      await lib.discord.channels['@0.2.1'].messages.destroy({
        message_id: context.params.event.id,
        channel_id: context.params.event.channel_id,
      });
    } catch (error) {
      console.error(`Could not delete the message, error detected: ${error}`);
      await lib.discord.channels['@0.2.2'].messages.create({
        channel_id: `${logchannel}`,
        content: `A message was detected with a suspicious URL that could not be deleted. This is probably caused by another bot that already deleted the message. If the message was not deleted and this message still occured, please let us know in the NADB support server: <https://discord.gg/kuj6UTPtBQ>.`,
      });
    }

    // apply time-out to author
    try {
      await lib.discord.guilds['@0.2.1'].members.timeout.update({
        user_id: `${context.params.event.author.id}`,
        guild_id: `${context.params.event.guild_id}`,
        communication_disabled_until_seconds: 1209600,
        reason: `Suspicious URL send in server`,
      });
    } catch (error) {
      console.error(error);
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: logchannel,
        content: `Missing permissions to apply a timeout to <@${context.params.event.author.id}>`,
        tts: false,
      });
    }

    // mention that there was a sus url spotted
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: '',
      tts: false,
      embeds: [
        {
          type: 'rich',
          title: `Suspicious link spotted`,
          description: `Hi <@${context.params.event.author.id}>,\nIt seems that the url you send links to a website with suspicious activity. If you believe this was an error, please reach out to one of our staff members.\n\nTo prevent further harm to other members of ${guildinfo.name}, we have muted you. Other actions might be taken by the staff team.`,
          color: 0xcc2936,
        },
      ],
    });

    let messagecontentwithoutURL = messagecontent.replace(
      urltoscan,
      `\`${urltoscan}\``
    );

    // send a message in modlog with buttons to ban/unmute/keep the user muted
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: logchannel,
      content: `<@&${staffrole}>. Suspicious link sent by: <@${context.params.event.author.id}>`,
      tts: false,
      components: [
        {
          type: 1,
          components: [
            {
              style: 4,
              label: `Ban ${context.params.event.author.username}`,
              custom_id: `ban_link_sender`,
              disabled: false,
              emoji: {
                id: `889584957415100417`,
                name: `BanPLS`,
                animated: false,
              },
              type: 2,
            },
            {
              style: 3,
              label: `Unmute ${context.params.event.author.username}`,
              custom_id: `unmute_link_sender`,
              disabled: false,
              emoji: {
                id: `895041699699642430`,
                name: `unmute`,
                animated: false,
              },
              type: 2,
            },
          ],
        },
      ],
      allowed_mentions: {
        replied_user: false,
        parse: ['roles', 'users', 'everyone'],
      },
      embeds: [
        {
          type: 'rich',
          title: `Suspicious link spotted!`,
          description: '',
          color: 0x00ffff,
          fields: [
            {
              name: `Author`,
              value: `<@${context.params.event.author.id}> (ID: \`${context.params.event.author.id}\`)`,
              inline: true,
            },
            {
              name: `Channel`,
              value: `<#${context.params.event.channel_id}>`,
              inline: true,
            },
            {
              name: `Suspicious domain`,
              value: `\`${urltoscan}\``,
              inline: true,
            },
            {
              name: `Message`,
              value: `${messagecontentwithoutURL}`,
              inline: true,
            },
            {
              name: `Date and time`,
              value: `<t:${unixTime}:f> (<t:${unixTime}:R>)`,
              inline: true,
            },
            {
              name: `Please report the url if it is a phishing website`,
              value: `https://phish.report/${urltoscan}`,
              inline: false,
            },
          ],
          footer: {
            text: `Be aware that clicking the suspicious URL might cause harm to your account and/or your computer.`,
            icon_url: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/1200px-Antu_dialog-warning.svg.png`,
            proxy_icon_url: `https://phish.report/${urltoscan}`,
          },
        },
      ],
    });
  } else {
    console.log(`URL was not deemed suspicious`);
  }
} else {
  console.log(`No URL found`);
}

// Feel free to ping Lars.#0018 (<@119473151913623552>) in the Autocode Discord server for help or suggestions!
