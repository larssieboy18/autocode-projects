// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// provides Base64 encoding used in some functions
const Base64 = require('js-base64');

// define guild
let guild = process.env.guildID;

console.log(`Version: 1.0.8`);

module.exports = {
  // code for opening modmail
  open_modmail: async (
    user,
    username,
    discriminator,
    guild,
    modmailcategory,
    content,
    memberinfo,
    staffrole,
    createdbyuser
  ) => {
    console.log(`Opening modmail for ${user} (${username})`);
    // replace all unsafe characters in a user's username
    let channelname = username.replace(/\W/gi, '_') + '-' + discriminator;
    // create the channel
    let modmailchannel = await lib.discord.guilds['@0.2.2'].channels.create({
      guild_id: `${guild}`,
      name: `${channelname}`,
      type: 0,
      parent_id: `${modmailcategory}`,
    });
    // make a list with the user's role in mentioned form
    let memberroles = [];
    if (!memberroles[0]) {
      memberroles = `_User has no roles in this server_`;
    } else {
      for (let i = 0; i < memberinfo.roles.length; i++) {
        memberroles.push(` <@&` + memberinfo.roles[i] + `>`);
      }
    }

    // calculate the time when the user joined the server
    let joinage = Math.floor(Date.parse(memberinfo.joined_at) / 1000);

    // send the initial message inside the modmail channel
    let initialmessage = await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${modmailchannel.id}`,
      content: `<@&${staffrole}>: A new modmail has been opened ${createdbyuser} <@${user}>`,
      tts: false,
      embeds: [
        {
          type: 'rich',
          title: ``,
          description: `User ID: \`${user}\``,
          color: 0x367120,
          fields: [
            {
              name: `User's roles`,
              value: `${memberroles}`,
              inline: true,
            },
            {
              name: `Joined the server`,
              value: `<t:${joinage}:R>`,
              inline: true,
            },
            {
              name: `Initial message`,
              value: `${content}`,
              inline: false,
            },
          ],
        },
      ],
      components: [
        {
          type: 1,
          components: [
            {
              style: 4,
              label: `Close modmail`,
              custom_id: `close_modmail`,
              disabled: false,
              emoji: {
                id: `816694015286050858`,
                name: `a_cross`,
                animated: true,
              },
              type: 2,
            },
          ],
        },
      ],
    });

    // pin the first message
    await lib.discord.channels['@0.3.0'].pins.create({
      message_id: `${initialmessage.id}`,
      channel_id: `${modmailchannel.id}`,
    });

    // save the modmail channel ID
    await lib.utils.kv['@0.1.16'].set({
      key: `${user}_${guild}_modmail`,
      value: `${modmailchannel.id}`,
    });

    // send a confirmation message to the user
    try {
      let confirmationmessage = await lib.discord.users['@0.2.0'].dms.create({
        recipient_id: `${user}`,
        content: `📫 Your modmail thread has been created! Please be patient while our staffteam takes a look at it. We will reply as soon as possible.`,
      });

      // send the confirmation message in the modmail channel for staff members to see
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: `${modmailchannel.id}`,
        content: `**BOT:** ${confirmationmessage.content}`,
        tts: false,
      });
    } catch (error) {
      console.error(`Error occured: ${error}`);
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${modmailchannel.id}`,
        content: `Unable to send a DM to the user. The most likely cause for this is that they have DM's disabled. Please ask them to open their DM's in this server by following the instructions listed at https://discord.com/safety/360043857751-Four-steps-to-a-super-safe-account`,
      });
    }
    return modmailchannel.id;
  },

  // code for closing a modmail
  close_modmail: async (guild, channel, token, pinnedmessages) => {
    let days = process.env.deleteAfter;
    // gets modmail category
    let modmailcategory = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_modmailcategory`,
    });

    // get the ID of the archive category
    let archive = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_archivecategory`,
    });

    // get information about the channel
    let channelinfo = await lib.discord.channels['@0.3.0'].retrieve({
      channel_id: `${channel}`,
    });

    // if the modmail is already archived, send an error
    if (channelinfo.parent_id == archive) {
      return await lib.discord.interactions[
        '@0.1.0'
      ].followups.ephemeral.create({
        token: `${token}`,
        content: `This modmail has already been archived. Please select a different channel.`,
      });

      // if the channel is not an open modmail, send an error message and stop the code
    } else if (channelinfo.parent_id !== modmailcategory) {
      return await lib.discord.interactions[
        '@0.1.0'
      ].followups.ephemeral.create({
        token: `${token}`,
        content: `This is not an open modmail. Please select a different channel.`,
      });
    }

    // to make sure we only get back the initial message, get rid of everything else
    let initialmessage = pinnedmessages.slice(-1);

    let user = initialmessage[0].mentions[0].id;
    console.log(user);

    // close modmail, aka move it to archive modmails
    await lib.discord.guilds['@0.2.2'].channels.update({
      guild_id: `${guild}`,
      id: `${channel}`,
      lock_permissions: true,
      parent_id: `${archive}`,
    });

    // clear the kv value so the user can make a new modmail in the future if they want to
    await lib.utils.kv['@0.1.16'].clear({
      key: `${user}_${guild}_modmail`,
    });

    // saves the time when the channel should get deleted
    let now = new Date().getTime();
    let timeperday = 1000 * 60 * 60 * 24;
    let timetoclose = timeperday * days + now;
    let ttl1 = timetoclose + timeperday * 2;
    let closetime = await lib.utils.kv['@0.1.16'].set({
      key: `${channel}_closetime`,
      value: `${timetoclose}`,
      ttl: ttl1,
    });

    // send a message to the user about the modmail closure
    try {
      await lib.discord.users['@0.2.0'].dms.create({
        recipient_id: `${user}`,
        content: `**Modmail closed**\nThank you for contacting staff! We hope your issue has been resolved and we have closed the modmail for now. If there is anything else we can help you with, be sure to just send us another message!`,
      });
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${channel}`,
        content: `**BOT:** \nThank you for contacting staff! We hope your issue has been resolved and we have closed the modmail for now. If there is anything else we can help you with, be sure to just send us another message!`,
      });
    } catch (error) {
      console.error(`Error occured: ${error}`);
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${channel}`,
        content: `Unable to send a DM to the user about closing the modmail. The most likely cause for this is that they have DM's disabled or left the guild.\n**Error: ${error}**`,
      });
    }

    let archivedmodmail = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_logchannel`,
    });

    await lib.discord.guilds['@0.2.2'].channels.update({
      guild_id: `${guild}`,
      id: `${archivedmodmail}`,
      position: 0,
    });

    return await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${channel}`,
      content: `Modmail has been succesfully closed and archived. Messages sent in here will **not** be sent to the user anymore. You can use \`/modmail open <user>\` to open a new modmail for the user.`,
    });
  },
  reply_modmail: async (event, replytext, channelinfo) => {
    let user = event.author.id;
    let username = event.author.username;
    let discriminator = event.author.discriminator;
    let channel = event.channel_id;
    let content = event.content;
    let message_id = event.id;

    // gets modmail category
    let modmailcategory = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_modmailcategory`,
    });

    // if the command was not executed inside the modmail category, ignore it
    if (channelinfo.parent_id !== modmailcategory) {
      return console.error(
        `Command '${content}' was not executed inside the modmail category. Ignoring...`
      );
    }
    // list all pinned messages inside a modmail (the initial message automatically gets pinned)
    let pinnedmessages = await lib.discord.channels['@0.3.0'].pins.list({
      channel_id: `${channel}`,
    });

    // to make sure we only get back the initial message, get rid of everything else
    let initialmessage = pinnedmessages.slice(-1);

    // extract the member that the modmail is with from the modmail
    let member = initialmessage[0].mentions[0].id;

    // make sure attachments are properly processed
    let attachmentsurls = [];
    if (event.attachments.length > 0) {
      for (let i = 0; i < event.attachments.length; i++) {
        let attachment = event.attachments[i];
        attachmentsurls.push(` ${attachment.proxy_url} `);
      }
    }
    //send a DM to the user with the response, F8the attachments if they are present
    await lib.discord.users['@0.2.0'].dms.create({
      recipient_id: `${member}`,
      content: `**${username}**: ${replytext} \n${attachmentsurls}`,
    });

    // send the message of the staff member in a new format in the modmail channel, including attachments if they are present
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${channel}`,
      content: `**${username}**: ${replytext} \n${attachmentsurls}`,
    });

    // delete the message send by the staff, as it is replaced by the message above
    await lib.discord.channels['@0.3.0'].messages.destroy({
      message_id: `${message_id}`,
      channel_id: `${channel}`,
    });
  },
  // this needs to log the message send by either user or staff (DM, !r, !reply and !note) to the database so it can be retrieved later when closing modmail
  log_message: async (channelid, event, messagecontent, direction) => {
    let username;
    let userid;
    if (event.author) {
      username = event.author.username;
      userid = event.author.id;
    } else {
      username = event.user.username;
      userid = event.user.id;
    }
    let timestamp = event.timestamp;

    // emoji's are not supported in .txt files, which is why we need to filter them out to increase readability
    let content = messagecontent.replace(
      /(<a?:[\w]+:[0-9]+>)|(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi,
      '[EMOJI]'
    );

    // get the current messagecount
    let messagecount = await lib.utils.kv['@0.1.16'].get({
      key: `${channelid}_messagecount`,
      defaultValue: 0,
    });

    let time =
      new Date(timestamp).toLocaleDateString(`en-gb`, {
        year: `numeric`,
        month: `long`,
        day: `numeric`,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }) +
      ` ` +
      // be aware that this will get the timezone that Autocode uses (which is UTC) and not your own timezone
      Intl.DateTimeFormat().resolvedOptions().timeZone;

    // if attachments are present, make sure to handle them properly
    if (event.attachments.length > 0) {
      content = content + `\nAttachments:`;
      for (let i = 0; i < event.attachments.length; i++) {
        let attachment = event.attachments[i];
        content = content + `\n${attachment.proxy_url}`;
      }
    }

    // log the message in the database
    let logtodb = await lib.http.request['@1.1.6'].post({
      url: `https://api.m3o.com/v1/db/Create`,
      authorization: `${process.env.m3oKey}`,
      headers: {
        'Content-Type': `application/json`,
      },
      params: {
        record: {
          id: `${messagecount}`,
          User: `${username}`,
          Userid: `${userid}`,
          Timestamp: `${time}`,
          Message: `${content}`,
          Direction: `${direction}`,
        },
        table: `${channelid}`,
      },
    });

    // send success message inside the console
    console.log(`Message logged to id ${logtodb.data.id}`);

    // increment the messagecount
    await lib.utils.kv['@0.1.16'].set({
      key: `${channelid}_messagecount`,
      value: ++messagecount,
    });
  },

  // when the modmail gets closed, we want the database to send all data to the log and post that message into the channel. That is what this is for
  messages_fromdb_tolog: async (channel, guild, user, pinnedmessages) => {
    let memberUsername = user.username;

    // get the amount of messages logged inside the database
    let amountofmessages = await lib.http.request['@1.1.6'].post({
      url: `https://api.m3o.com/v1/db/Count`,
      authorization: `${process.env.m3oKey}`,
      headers: {
        'Content-Type': `application/json`,
      },
      params: {
        table: `${channel}`,
      },
    });

    let texttolog = ``;

    for (let i = 0; i < amountofmessages.data.count; i++) {
      // get information about the message
      let dbdata = await lib.http.request['@1.1.6'].post({
        url: `https://api.m3o.com/v1/db/Read`,
        authorization: `${process.env.m3oKey}`,
        headers: {
          'Content-Type': `application/json`,
        },
        params: {
          table: `${channel}`,
          query: `id == ${i}`,
        },
      });

      // sets some variables for easier use in the code below
      let username = dbdata.data.records[0].User;
      let userid = dbdata.data.records[0].Userid;
      let time = new Date(dbdata.data.records[0].Timestamp);
      let content = dbdata.data.records[0].Message;
      let direction = dbdata.data.records[0].Direction;

      // make the date look nicer in the log message
      const y = time.getFullYear();
      const m = time.getMonth() + 1; // 0 index based
      const d = time.getDate();
      const h = time.getHours();
      const min = time.getMinutes();

      // add all information to the log
      texttolog =
        texttolog +
        `${direction} - ${username} (${userid}) ${y}/${m}/${d} ${h}:${min}: ${content} \n`;
    }

    // generate a unique ID for each modmail
    let modmailthreadid = Math.round(
      (new Date().getTime() * user.id * guild) / 1e35
    ).toString();

    // upload a log of the modmail to M3O and generate a sharable URL
    let pushtofile = await lib.CreeperTown.m3o['@0.0.2'].file.save({
      token: `${process.env.m3oKey}`,
      content: `${texttolog}`,
      path: `/${Base64.encode(modmailthreadid)}.txt`,
      project: `modmaillog`,
      public: true,
    });

    // useful for debugging
    console.log(pushtofile);
    if (
      pushtofile.status == `Unauthorized` ||
      pushtofile.detail == `Unauthorized`
    ) {
      console.error(
        `You are using an invalid API key. Please refer to the FAQ in the Readme to see how you can fix this if it worked before.`
      );
      pushtofile.url = `**ERROR** Invalid API key. Please check the logs for more info **ERROR**`;
    }

    // get the ID of the modmail-logs channel
    let logchannel = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_logchannel`,
    });

    // send a new message inside the modmail-logs channel with some data about the closed modmail
    let logmessage = await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${logchannel}`,
      content: `The modmail with ${memberUsername} (ID: \`${user.id}\`) has succesfully been closed. You can find the log at <${pushtofile.url}> or in <#${channel}> if the channel still exists.`,
    });

    // save the ID of the logmessage so it can be edited when the original channel gets deleted.
    let logmessagettl = 1000 * 60 * 60 * 24 * (process.env.deleteAfter + 2);
    await lib.utils.kv['@0.1.16'].set({
      key: `${channel}_logmessage`,
      value: `${logmessage.id}`,
      ttl: logmessagettl,
    });

    // logs metadata about the modmail to a database
    await lib.http.request['@1.1.6'].post({
      url: `https://api.m3o.com/v1/db/Create`,
      authorization: `${process.env.m3oKey}`,
      headers: {
        'Content-Type': `application/json`,
      },
      params: {
        record: {
          Username: `${memberUsername}`,
          User_ID: `${user.id}`,
          Total_logged_messages: `${amountofmessages.data.count}`,
          Log_URL: `${pushtofile.url}`,
          Close_Time:
            new Date().toLocaleDateString(`en-gb`, {
              year: `numeric`,
              month: `long`,
              day: `numeric`,
              hour: 'numeric',
              minute: 'numeric',
              hour12: false,
            }) +
            ` ` +
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          id: `${modmailthreadid}`,
        },
        table: `Modmails`,
      },
    });

    // clear the KV-pair that saves the user's modmail, as there is none anymore
    let clearModmail = await lib.utils.kv['@0.1.16'].clear({
      key: `${user.id}_${guild}_modmail`,
    });
    console.log(clearModmail);

    // clear the amount of messages that were send in the modmail channel. This only exists to keep the amount of KV-pairs down.
    await lib.utils.kv['@0.1.16'].clear({
      key: `${channel}_messagecount`,
    });
  },
  dm_to_modmail: async (modmail, event) => {
    let author = event.author;
    let username = author.username;
    let content = event.content;
    let attachmentsurls = [];

    // if no attachments are send, "just" send the content of the message to the modmail thread
    if (event.attachments.length == 0) {
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: `${modmail}`,
        content: `**${username}**: ${content}`,
        tts: false,
      });
      // if there are attachment and NO text, just send the attachments
    } else if (!event.content && event.attachments.length > 0) {
      for (let i = 0; i < event.attachments.length; i++) {
        let attachment = event.attachments[i];
        attachmentsurls.push(` ${attachment.proxy_url} `);
      }
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${modmail}`,
        content: `**${username}**:${attachmentsurls}`,
      });
      // if there are both text and attachments, send the text and a system message that the message also contains attachments. Send the attachments after the message
    } else if (event.content.length > 0 && event.attachments.length > 0) {
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: `${modmail}`,
        content: `**${username}**: ${content} \n**SYSTEM MESSAGE**: The following attachments were send with this message:`,
        tts: false,
      });
      for (let i = 0; i < event.attachments.length; i++) {
        let attachment = event.attachments[i];
        attachmentsurls.push(` ${attachment.proxy_url} `);
      }
      await lib.discord.channels['@0.3.0'].messages.create({
        channel_id: `${modmail}`,
        content: `${attachmentsurls}`,
      });
      // any of the 3 options above should be triggered. If that is not the case, please report the error. Make sure to save the logs and payload of that requests
    } else {
      console.error(
        `An error occured during the processing of the message and/or attachment(s). Please report this to @Lars.#0018 in the Autocode Discord server`
      );
    }

    // react to the message so the user knows it was succesfully processed
    await lib.discord.channels['@0.3.0'].messages.reactions.create({
      emoji: `✅`,
      message_id: event.id,
      channel_id: event.channel_id,
    });
  },
};
