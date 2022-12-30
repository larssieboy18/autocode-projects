/*
This snippet scans all avatars of people that join your server to see if they contain NSFW, gore or offensive content.
If it does, it will ping your staff members in your log channel. You can get your free API key at https://dashboard.sightengine.com/api-credentials 
*/

// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Set credentials for use in Sight Engine
var sightengineAPI = process.env.SEapi;
var sightengineUSER = process.env.SEuser;

// Get data about new user
let newuser = await lib.discord.guilds['@0.1.1'].members.retrieve({
  user_id: `${context.params.event.user.id}`,
  guild_id: `${context.params.event.guild_id}`,
});

// Used for debugging. Shows data about user in console
console.log(newuser);

// make API request to Sight Engine and check the avatar of the user
let checkavatar = await lib.http.request['@1.1.6'].get({
  url: `https://api.sightengine.com/1.0/check.json`,
  queryParams: {
    models: `nudity,offensive,gore`, // This checks against nudity, offensive and gore pictures. If you want to check more categories, visit https://sightengine.com/docs/getstarted to see how to add those categories.
    url: `${newuser.user.avatar_url}`,
    api_user: `${sightengineUSER}`,
    api_secret: `${sightengineAPI}`,
  },
});

// Used for debugging. Shows request
console.log(checkavatar);
let cad = checkavatar.data;

// If picture contains too much "bad content", ping staff members. Feel free to customize the numbers to what you feel comfortable with.
if (cad.nudity.raw > 0.25 || cad.offensive > 0.25 || cad.gore > 0.25) {
  // Dont forget to list the categories the extra categories that you added in line 21 here.
  await lib.discord.channels['@0.2.1'].messages.create({
    channel_id: `${process.env.LOGCHANNEL}`,
    content: `<@&${process.env.ADMINROLE}>. <@${context.params.event.user.id}> probably has a bad profile picture! Please take a look!`,
  });
  console.log(`${context.params.event.user.username}'s is bad!`);
} else {
  // Used for debugging.
  console.log(`${context.params.event.user.username}'s avatar looks clean!`);
}
