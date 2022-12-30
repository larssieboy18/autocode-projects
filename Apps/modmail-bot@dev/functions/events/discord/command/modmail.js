/*
This file will do multiple things:
1. Create the modmail category and make sure everything runs smoothly
2. Let staff open a new modmail by mentioning a user
3. ??
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// enables use of the helper file
const helpers = require('../../../../helpers/helper.js');

// set variables
let guild = process.env.guildID;
let staffrole = process.env.staffroleID;
let requester = context.params.event.member;
let subcommand = context.params.event.data.options[0].name;
let ephToken = context.params.event.token;

// check whether or not the guild is the same as provided in the variables
if (context.params.event.guild_id !== guild) {
  console.error(
    `The guild you have provided in the variables (${guild}) does not match this guild (${context.params.event.guild_id}). This will most likely result in the bot not working properly. Support for this is NOT provided under any circumstances.`
  );
}

// only run the command if the user has the staff role
if (
  requester.roles.includes(staffrole) ||
  requester.permission_names.includes(`ADMINISTRATOR`) ||
  requester.permission_names.includes(`MANAGE_GUILD`)
) {
  if (subcommand == `setup`) {
    console.log(`setup`);

    // to prevent unnecessary errors, we check if modmail has been enabled
    let modmailEnabled = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_modmailEnabled`,
      defaultValue: false,
    });

    if (modmailEnabled == true) {
      console.error(
        `Modmail has already been setup. Please manually clear the kv-pair and try again.`
      );
      return await lib.discord.interactions[
        '@1.0.1'
      ].responses.ephemeral.create({
        token: `${context.params.event.token}`,
        content: `Modmail has already been setup. Please contact the bot's admin to fix this issue.`,
        response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
      });
    }

    let botUser = (await lib.discord.users['@0.2.0'].me.list()).id;

    // make an archive category
    let archivecategory = await lib.discord.guilds['@0.2.2'].channels.create({
      guild_id: `${guild}`,
      name: `Archived modmails`,
      type: 4,
      permission_overwrites: [
        {
          id: staffrole,
          type: 0,
          allow: 1024,
          deny: 10320,
        },
        {
          id: `${guild}`, // this is the equivalent to the @everyone role
          type: 0,
          deny: 1024,
        },
        {id: `${botUser}`, type: 1, allow: 8},
      ],
    });

    // save the ID of the new category so it can be used in other files
    await lib.utils.kv['@0.1.16'].set({
      key: `${guild}_archivecategory`,
      value: `${archivecategory.id}`,
    });

    // create a channel that will store all links to previous modmails
    let logchannel = await lib.discord.guilds['@0.2.2'].channels.create({
      guild_id: `${guild}`,
      name: `modmail-logs`,
      type: 0,
      topic: `All links to previous modmails will be stored here`,
      parent_id: `${archivecategory.id}`,
    });

    // save the ID of the new channel so it can be used in other files
    await lib.utils.kv['@0.1.16'].set({
      key: `${guild}_logchannel`,
      value: `${logchannel.id}`,
    });

    // if no category is provided, a new modmail category will be created
    if (!context.params.event.data.options[0].options[0]) {
      let modmailcategory = await lib.discord.guilds['@0.2.2'].channels.create({
        guild_id: `${guild}`,
        name: `Modmail`,
        type: 4,
        permission_overwrites: [
          {
            id: staffrole,
            type: 0,
            allow: 412349877824,
            deny: 16,
          },
          {
            id: `${guild}`, // this is the equivalent to the @everyone role
            type: 0,
            deny: 1024,
          },
          {id: `${botUser}`, type: 1, allow: 8},
        ],
      });

      // save the ID of the new category so it can be used in other files
      await lib.utils.kv['@0.1.16'].set({
        key: `${guild}_modmailcategory`,
        value: `${modmailcategory.id}`,
      });
    } else {
      // if a channel object (category, voice channel or text channel) is provided, make sure that it is actually a category and set that category as the modmail category.
      let channelinfo = await lib.discord.channels['@0.3.0'].retrieve({
        channel_id: context.params.event.data.options[0].options[0].value,
      });
      if (channelinfo.type == 4) {
        // save the ID of the new category so it can be used in other files
        await lib.utils.kv['@0.1.16'].set({
          key: `${context.params.event.guild_id}_modmailcategory`,
          value: `${context.params.event.data.options[0].options[0].value}`,
        });
      } else {
        await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
          token: `${ephToken}`,
          content: `This command only works with categories. Please run the command again and provide a valid category.`,
        });

        // as the command fails after the archive has been made, delete those channels to prevent duplicates.
        await lib.discord.channels['@0.3.0'].destroy({
          channel_id: `${logchannel.id}`,
        });
        await lib.discord.channels['@0.3.0'].destroy({
          channel_id: `${archivecategory.id}`,
        });
      }
    }

    let modmailcategory = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_modmailcategory`,
    });

    // create a channel that will explain how modmail works
    let modmailcommandchannel = await lib.discord.guilds[
      '@0.2.2'
    ].channels.create({
      guild_id: `${guild}`,
      name: `modmail-commands`,
      type: 0,
      topic: `This channel will provide you with instructions on how to work with the modmail bot`,
      parent_id: `${modmailcategory}`,
    });

    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${modmailcommandchannel.id}`,
      content: '',
      tts: false,
      embeds: [
        {
          type: 'rich',
          title: `Modmail Instructions `,
          description: `Modmail is probably the most used way for server members to contact server staff. It works by forwarding all DM's that are sent to the modmail bot to the staff members in a channel in the server. This prevents staff members from having to answer questions in their own DM's and makes sure all staff members are aware of what is going on in the server. To make the most use out of the bot, a few commands are provided.\nBy default all modmails are uploaded to a storage provider so they can easily be accessed later. Apart from that, channels will be stored inside the category **<#${archivecategory.id}>** for ${process.env.deleteAfter} days. Upon closing a modmail, links to both are provided inside <#${logchannel.id}>.`,
          color: 0x367120,
          fields: [
            {
              name: `Saved messages`,
              value: `Only messages sent by staff prefixed with \`!r\`, \`!reply\` and \`!note\` will be saved in the logs. Messages from the user to the modmail will always be logged.`,
            },
            {
              name: `\`/modmail setup\``,
              value: `This command will setup the modmail bot in your server. As you are seeing this message, this has already been done.`,
              inline: true,
            },
            {
              name: `\`/modmail open <user>\``,
              value: `This will open a modmail for the specified user.`,
              inline: true,
            },
            {
              name: `\`/modmail close [channel]\``,
              value: `This will close an open modmail. If no channel is provided, it will close the channel the command is executed in (if that is an open modmail).`,
              inline: true,
            },
            {
              name: `\`!r\` or \`!reply\``,
              value: `This will allow a staff member to reply to a user's modmail. By default messages are not forwarded to the user, so staff members can easily talk to eachother about the open modmail. Using the command mentioned above a message will be sent to the user.`,
              inline: true,
            },
            {
              name: `\`!note\``,
              value: `By default not all messages are stored inside the logs. Prefix a message with \`!note\` to make it be saved inside the log.`,
              inline: true,
            },
            {
              name: `Example usage:`,
              value: `\`!r Hi there, how can we help you today?\`\n\n\`!note This user was banned from the server because they were spamming.\`\n\n\`/modmail open @Hadiyah\``,
              inline: true,
            },
          ],
        },
      ],
    });

    // to prevent unnecessary errors, we save that modmail has been enabled from now on
    await lib.utils.kv['@0.1.16'].set({
      key: `${guild}_modmailEnabled`,
      value: true,
    });
  } else if (subcommand == `open`) {
    console.log(`open`);

    let member = context.params.event.data.options[0].options[0].value;

    // get more info about the user
    let userinfo = await lib.discord.users['@0.2.0'].retrieve({
      user_id: `${member}`,
    });

    // get more info about the user in the guild, like roles etc
    let memberinfo = await lib.discord.guilds['@0.2.2'].members.retrieve({
      user_id: `${member}`,
      guild_id: `${guild}`,
    });

    // gets modmail category
    let modmailcategory = await lib.utils.kv['@0.1.16'].get({
      key: `${guild}_modmailcategory`,
    });

    // check if the user already has an open modmail
    let modmail = await lib.utils.kv['@0.1.16'].get({
      key: `${member}_${guild}_modmail`,
      defaultValue: false,
    });

    // staff members will only be able to open modmails if the user doesn't already have an active modmail
    if (modmail == false) {
      let modmailchannel = await helpers.open_modmail(
        member,
        userinfo.username,
        userinfo.discriminator,
        guild,
        modmailcategory,
        `This modmail has been opened by <@${requester.user.id}>`,
        memberinfo,
        staffrole,
        `for`
      );

      let direction = `Initial message, opened by ${requester.user.username}`;

      await helpers.log_message(
        modmailchannel,
        context.params.event,
        context.params.event.content,
        direction
      );
    } else {
      await lib.discord.interactions['@1.0.1'].followups.ephemeral.create({
        token: `${ephToken}`,
        content: `This user already has an open modmail. Please send the messages in <#${modmail}>`,
      });
    }
  } else if (subcommand == `close`) {
    console.log(`close`);

    // make sure that staff can close a channel of their choosing or the current channel if none is provided
    let channeltoclose;
    if (!context.params.event.data.options[0].options[0]) {
      channeltoclose = context.params.event.channel_id;
    } else {
      channeltoclose = context.params.event.data.options[0].options[0].value;
    }
    // list all pinned messages inside a modmail (the initial message automatically gets pinned)
    let pinnedmessages = await lib.discord.channels['@0.3.0'].pins.list({
      channel_id: `${channeltoclose}`,
    });

    let closeandmove = await helpers.close_modmail(
      guild,
      channeltoclose,
      ephToken,
      pinnedmessages
    );

    if (
      closeandmove.content !==
      `content: 'This modmail has already been archived. Please select a different channel.`
    ) {
      // to make sure we only get back the initial message, get rid of everything else
      let initialmessage = pinnedmessages.slice(-1);

      // extract the member that the modmail is with from the modmail
      let member = initialmessage[0].mentions[0];

      await helpers.messages_fromdb_tolog(channeltoclose, guild, member);
    } else {
      console.error(
        `This channel is not an open modmail. Please select a different channel.`
      );
    }
  } else {
    return console.error(`invalid subcommand`);
  }
} else {
  await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
    token: `${ephToken}`,
    content: `You do not have sufficient permissions to run this command. Please contact an admin of the server if you believe this is an error.`,
  });
}
