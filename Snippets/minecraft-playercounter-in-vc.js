/*
This snippet will update a voice channel frequently with the amount of people that are playing on your Minecraft server.
Make sure you do not set it to update more frequently than every 6 minutes, otherwise it will get rate limited by Discord. 
*/

const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// get data about server
let serverdata = await lib.http.request['@1.1.6'].get({
  url: `https://mcapi.xdefcon.com/server/${process.env.serverIP}/full/json`,
});

// get data about what was the latest change - helps a lot against rate limiting
let serverupdated = await lib.utils.kv['@0.1.16'].get({
  key: `lastserverchange`,
});

// log data about server
console.log(`Statuscode: ${serverdata.statusCode}`);
console.log(serverdata.data);

// set online status
let serverstatus = serverdata.data.serverStatus;

// update VC accordingly
try {
  // set VC when server is offline
  if (serverstatus == `offline`) {
    if (serverupdated !== `offline`) {
      await lib.discord.channels['@0.3.0'].update({
        channel_id: process.env.channelID,
        name: `Server offline`,
      });
      await lib.utils.kv['@0.1.16'].set({
        key: `lastserverchange`,
        value: `offline`,
        ttl: 86400,
      });
    } else {
      console.log(`No change necessary`);
    }
    // set VC when server is online
  } else if (serverstatus == `online`) {
    let playercount = serverdata.data.players;
    // set VC when server has no players online
    if (playercount == 0) {
      if (serverupdated !== 0) {
        await lib.discord.channels['@0.3.0'].update({
          channel_id: process.env.channelID,
          name: `IP: ${process.env.serverIP}`,
        });
        await lib.utils.kv['@0.1.16'].set({
          key: `lastserverchange`,
          value: 0,
          ttl: 86400,
        });
      }
      // set VC when server has players online
    } else if (serverupdated !== playercount) {
      await lib.discord.channels['@0.3.0'].update({
        channel_id: process.env.channelID,
        name: `Players online: ${playercount}`,
      });
      await lib.utils.kv['@0.1.16'].set({
        key: `lastserverchange`,
        value: `${playercount}`,
        ttl: 86400,
      });
    } else {
      console.log(`No change necessary`);
    }
  } else {
    console.error(`Status wasn't offline or online.`);
  }
} catch (error) {
  console.error(error);
}

/*
Have any questions or comments?
Ping me (@Lars.#0018) in the Autocode Discord server :)
*/