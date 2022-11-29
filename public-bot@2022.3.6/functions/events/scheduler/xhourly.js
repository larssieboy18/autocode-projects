const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let count = await lib.meiraba.utils['@1.1.0'].discord.bot_server_count({
  bot_id: `${process.env.botID}`,
});
console.log(`Server count: ${count} servers`);

// async function getCount(id = null) {
// await sleep(1000);
// let result = await lib.discord.guilds['@0.1.0'].list({
// limit: 100,
// after: id,
// });

// let count = result.length;
// if (result.length % 100 === 0) count += await getCount(result[99].id);
// return count;
// }

// save to database
let serverCountkv = await lib.utils.kv['@0.1.16'].set({
  key: `${process.env.botID}_servercount`,
  value: `${count}`,
});

// Top.gg
let topggtoken = process.env.topGGtoken;
const Topgg = require(`@top-gg/sdk`);
const topggapi = new Topgg.Api(`${topggtoken}`);
let posttoTopgg = await topggapi.postStats({
  serverCount: count,
});
console.log(`TopGG (https://top.gg):`);
console.log(posttoTopgg);

// discordlist.space
let postToDiscordList = await lib.http.request['@1.1.6'].post({
  url: `https://api.discordlist.space/v2/bots/${process.env.botID}`, // should be 909192226654015539   ${process.env.botID}
  headers: {
    'Content-Type': `application/json`,
    Authorization: `${process.env.discordlistKey}`,
  },
  params: {
    serverCount: `${count}`,
  },
});
await console.log(`Discord List (https://discordlist.space):`);
console.log(postToDiscordList.data);

// discords.com
let postToDiscords = await lib.http.request['@1.1.6'].post({
  url: `https://discords.com/bots/api/bot/${process.env.botID}`, // should be 909192226654015539   ${process.env.botID}
  headers: {
    Authorization: `${discordsKey}`,
  },
  params: {
    server_count: `${count}`,
  },
});

// https://docs.discord-botlist.eu/api/api-endpoints
// let result = await lib.http.request['@1.1.6'].post({
// url: `https://api.discord-botlist.eu/v1/update`,
// authorizat

let betterUptime = await lib.http.request['@1.1.6'].post({
  url: `https://betteruptime.com/api/v1/heartbeat/${process.env.BUheartbeat}`,
  headers: {},
  params: {},
});

console.log(betterUptime)

ion: `API KEY HERE`,
// params: {
// 'serverCount': `${count}`
// }
// });

await console.log(`Discords (https://discords.com):`);
await console.log(postToDiscords.data);

// status
await lib.discord.users['@0.1.4'].me.status.update({
  activity_name: `with ${count} servers`,
  activity_type: 'GAME',
  status: 'ONLINE',
});
