// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// sets some variables
let requester = context.params.event.member.user.id;
let input = context.params.event.data;
console.log(input.options);

// check whether the input was a valid date
let date;
if (
  !input.options[0].value.match(
    /\b(?:[2-9]\d{3}|1[7-9]\d\d)\/(?:(?:0[^2]|1[0-2])\/(?:[0-2]\d|3[0-1])|02\/(?:[0-1]\d|2[0-8]))\b/
  )
) {
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Please send the date in \`YYYY/MM/DD\` format`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
} else {
  date = input.options[0].value;
}
// check whether the input was a valid time
let time;
if (
  !input.options[1].value.match(
    /\b(?:(?:[0-1]\d|2[0-3])\:[0-5]\d:[0-5]\d|(?:[0-1]\d|2[0-3])\:[0-5]\d)\b/
  )
) {
  return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Please send the time in \`HH:MM:SS\` or \`HH:MM\` format`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  });
} else {
  time = input.options[1].value;
}

// check if an offset was provided
let offset = 0;
if (input.options[3]) {
  offset = input.options[3].value;
}

// get information about the date
let dateArray = date.split(`/`);
let year = Number(dateArray[0]);
let month = Number(dateArray[1]) - 1; //months start at 0
let day = Number(dateArray[2]);

// get information about the time
let timeArray = time.split(`:`);
let hours = Number(timeArray[0]) - 2 + offset;
let minutes = Number(timeArray[1]);
// seconds are optional, so handle them correctly
let seconds;
if (timeArray.length > 2) {
  seconds = timeArray[2];
} else {
  seconds = 0;
}
// log all data to make sure everything worked correctly
console.log(year, month, day, hours, minutes, seconds);

// convert time to timestamp
let timeinsec = Math.floor(
  new Date(year, month, day, hours, minutes, seconds).getTime() / 1000
);

// get the desired format
let format = input.options[2].value;

// return the result to the user
return await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  token: `${context.params.event.token}`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: ``,
  embeds: [
    {
      type: 'rich',
      title: `Timestamp`,
      description: `<t:${timeinsec}:${format}> (\`<t:${timeinsec}:${format}>\`)`,
      color: 0x2b5a1a,
    },
  ],
});
