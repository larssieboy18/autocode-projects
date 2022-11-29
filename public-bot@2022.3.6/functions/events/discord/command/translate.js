// set variables
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event;
var apiKey = process.env.dApiKey;
var text = event.data.options[0].value;
var target_language = event.data.options[1].value;
var maxlength = 500;

// Make it look like the bot is thinking :)
await lib.discord.channels['@0.2.2'].typing.create({
  channel_id: context.params.event.channel_id,
});

// make sure that the content doesn't go over the maximum allowed length
if (text.length > maxlength) {
  await lib.discord.interactions['@1.0.1'].responses.create({
    token: `${context.params.event.token}`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `Hi there! I can only translate up to ${maxlength} characters at a time. Please shorten your message and try again!`,
  });
  console.error(`Text was too long`);
} else {
  // ask DeepL politely to translate the text for you
  let translation = await lib.http.request['@1.1.6']({
    method: 'POST',
    url: `https://api-free.deepl.com/v2/translate`,
    queryParams: {
      text: `${text}`,
      target_lang: `${target_language}`,
      auth_key: `${apiKey}`,
      split_sentences: `nonewlines`,
    },
  });

  // set some more variables
  var response = translation.body.toString();
  var translatedtext = response.slice(58, -4);
  var time = translation.headers.date;

console.log(translation.headers)
console.log(response)
  // make embed with result
  //await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    await lib.discord.channels['@0.3.1'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
    //token: `${event.token}`,
    content: ``,
    //response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    embeds: [
      {
        type: 'rich',
        title: `Translated text`,
        description: `Here is your translated text!`,
        color: 0x367120,
        fields: [
          {
            name: `Source text`,
            value: `${text}`,
            inline: true,
          },
          {
            name: `Translated text`,
            value: `${translatedtext}`,
            inline: true,
          },
        ],
        footer: {
          text: `Translated at ${time}`,
        },
      },
    ],
  });
}
