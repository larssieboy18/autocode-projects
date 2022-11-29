// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (
  context.params.event.author.id == '119473151913623552' &&
   context.params.event.guild_id == `909201849494671361`
  //context.params.event.guild_id == '909122979844194374'
) {
  
  let guild = '909122979844194374'
  
  // timestamp command
  await lib.discord.commands['@0.0.0'].create({
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
        description:
          'Format: HH:MM:SS, input the time you want to be converted',
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
        name: 'utc-offset',
        description:
          'Specify the difference between your timezone and UTC (defaults to 0). If unsure, run /timezone',
      },
    ],
  });

  console.log(`Timestamp command was succesfully created`);

  // timezone command
  await lib.discord.commands['@0.0.0'].create({
    name: 'timezone',
    description: 'Get the timezone of a city compared to UTC',
    options: [
      {
        type: 3,
        name: 'city',
        description: 'The city you want to get the timezone of',
        required: true,
      },
    ],
  });
  console.log(`Timezone command was succesfully created`);
} else {
  console.error(`Someone tried running this command that wasn't Lars`);
}
