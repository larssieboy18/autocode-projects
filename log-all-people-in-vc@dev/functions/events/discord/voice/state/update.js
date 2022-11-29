// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let {
  channel_id,
  guild_id,
  user_id,
  member,
  self_video,
  self_mute,
  self_deaf,
  mute,
  deaf,
} = context.params.event;

// get the current info from the kv-pairs
let uservc = await lib.utils.kv['@0.1.16'].get({
  key: `${user_id}_${guild_id}_voiceState`,
  defaultValue: {
    channel_id: null,
  },
});

// if there was no data in the kv-pair, the user just joined a vc
if (uservc.channel_id == null) {
  console.log(`${member.user.username} just joined a VC`);
  await lib.utils.kv['@0.1.16'].set({
    key: `${user_id}_${guild_id}_voiceState`,
    value: {
      username: member.user.username,
      userid: member.user.id,
      channel_id: channel_id,
      self_video: self_video,
      self_mute: self_mute,
      self_deaf: self_deaf,
      mute: mute,
      deaf: deaf,
      timestamp_join: new Date().getTime(),
      last_change: new Date().getTime(),
    },
    ttl: 86400,
  });
} // if there is no channel id (aka channel_id = null), the user left the voice channel
else if (!channel_id) {
  console.log(`${member.user.username} left the VC`);
  await lib.utils.kv['@0.1.16'].clear({
    key: `${user_id}_${guild_id}_voiceState`,
  });
} // if the saved channel id and the new channel id don't match, the user switched vc's
else if (channel_id !== uservc.channel_id) {
  console.log(`${member.user.username} switched VC's`);
  await lib.utils.kv['@0.1.16'].set({
    key: `${user_id}_${guild_id}_voiceState`,
    value: {
      username: member.user.username,
      userid: member.user.id,
      channel_id: channel_id,
      self_video: self_video,
      self_mute: self_mute,
      self_deaf: self_deaf,
      mute: mute,
      deaf: deaf,
      timestamp_join: uservc.timestamp_join,
      last_change: new Date().getTime(),
    },
    ttl: 86400,
  });
} //if the saved channel id and the new channel id match, the user updated something else
else if (channel_id == uservc.channel_id) {
  console.log(`${member.user.username} updated something in the VC`);
  await lib.utils.kv['@0.1.16'].set({
    key: `${user_id}_${guild_id}_voiceState`,
    value: {
      username: member.user.username,
      userid: member.user.id,
      channel_id: channel_id,
      self_video: self_video,
      self_mute: self_mute,
      self_deaf: self_deaf,
      mute: mute,
      deaf: deaf,
      timestamp_join: uservc.timestamp_join,
      last_change: new Date().getTime(),
    },
    ttl: 86400,
  });
}
