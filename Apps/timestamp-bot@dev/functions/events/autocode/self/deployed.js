// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// change this to a different ID if you want the command to appear in multiple servers. Alternatively, you can create a global command by omitting the guild parameter on line 6
let guild = `${process.env.guildID}`;

// timestamp command
await lib.discord.commands['@0.0.0'].create({
  guild_id: `${guild}`,
  name: 'timestamp',
  description: 'Convert a date and time to a Discord timestamp',
  options: [
    {
      type: 3,
      name: 'date',
      description:
        'Format: YYYY/MM/DD, input the date you want to be converted',
      required: true,
    },
    {
      type: 3,
      name: 'time',
      description: 'Format: HH:MM:SS, input the time you want to be converted',
      required: true,
    },
    {
      type: 3,
      name: 'formatting',
      description: 'How the timestamp will be formatted',
      choices: [
        {
          name: 'Short time',
          value: 't',
        },
        {
          name: 'Long Time',
          value: 'T',
        },
        {
          name: 'Short date',
          value: 'd',
        },
        {
          name: 'Long date',
          value: 'D',
        },
        {
          name: 'Short date and time',
          value: 'f',
        },
        {
          name: 'Long date and time',
          value: 'F',
        },
        {
          name: 'Relative',
          value: 'R',
        },
      ],
      required: true,
    },
    {
      type: 10,
      name: 'timezone',
      description:
        'Specify the difference between your timezone and UTC (defaults to 0)',
    },
  ],
});

console.log(`Timestamp command was succesfully created`);


// M3O stopped their free services. If you are willing to pay for their services, feel free to uncomment this section and run the file again.
// if (process.env.m3oKey !== 0 || process.env.m3oKey !== '0') {
  // // timezone command
  // await lib.discord.commands['@0.0.0'].create({
    // guild_id: `${guild}`,
    // name: 'timezone',
    // description: 'Get the timezone of a city compared to UTC',
    // options: [
      // {
        // type: 3,
        // name: 'city',
        // description: 'The city you want to get the timezone of',
        // required: true,
      // },
    // ],
  // });
  // console.log(`Timezone command was succesfully created`);
// } else {
  // console.log(
    // `Timezone command was not created, as you put 0 as M3O key, which disables this function`
  // );
// }
