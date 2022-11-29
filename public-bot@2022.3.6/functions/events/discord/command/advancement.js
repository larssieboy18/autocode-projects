const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let block = context.params.event.data.options[0].value;
let rawtitle = context.params.event.data.options[1].value;
let rawstring1 = context.params.event.data.options[2].value;
var rawstring2 = 0;
var string2 = 0;
if (context.params.event.data.options[3]) {
  var rawstring2 = context.params.event.data.options[3].value;
  var string2 = rawstring2.replace(/\W/g, '..');
}
let title = rawtitle.replace(/\W/g, '..');
let string1 = rawstring1.replace(/\W/g, '..');

console.log(block, title, string1, string2);
console.log(rawtitle.length, rawstring1.length, rawstring2.length);

// /if (title.length > 25 || string1.length > 25 || string2.length > 25) {
// console.log(`too long`);
// await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
// token: `${context.params.event.token}`,
// content: `The title and lines of the advancement can only contain up to 25 characters. Please shorten your message or use multiple lines.`,
// });
// } else {
console.log(`not too long`);
if (!context.params.event.data.options[3]) {
  console.log(`no string2`);
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `https://minecraft-api.com/api/achivements/${block}/${title}/${string1}`,
  });
} else {
  console.log(`string2 included`);
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `https://minecraft-api.com/api/achivements/${block}/${title}/${string1}/${string2}`,
  });
}
//}
