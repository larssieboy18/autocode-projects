# Modmail bot

# WARNING
M3O has stopped their free service. This means that this modmail bot will not work unless you pay for a subscription at M3O. We will look into alternatives, but be aware that they might be harder to implement.

## Description
This is a Modmail Discord bot, similar to Reddit's Modmail system. 
Members of a Discord server can direct message this bot to start a dialogue with the staff members. 
Within the Discord server, staff see this as a text channel being made. Staff can respond to the member in the channel, using the bot's prefix or slash commands.
If they send a message into the channel normally (with no prefix), it will only be seen in that channel and not sent to the user. 
This allows members to directly talk to staff members without unnecessary pinging and allows staff members to have a coherent dialogue about the subject of the Modmail in one place.

URL to share: https://autocode.com/app/creepertown/modmail-bot

# Team members
For support, please send a message to *@Lars.#0018* in the Autocode Discord server or a DM.
- *@Lars.#0018* ([Lars' Autocode profile](https://autocode.com/CreeperTown))
- *@Hadiyah#8787* ([Hadiyah's Autocode profile](https://autocode.com/hadiyah))

Thanks to *@𝙍𝙞𝙘𝙤#0135* for some bug fixing and ideas!

# Features
- [x] 1 command setup
- [x] Easy to use for members & for staff
- [x] Creates a `.txt` file log of the Modmail once closed
- [x] Automatically uploads logs to a secure file-sharing website
- [x] Logs support Discord attachments
- [x] Customisable role pinging when a Modmail is opened

# Set-up
1. Register an account at [M3O](https://m3o.com/register). M3O is the service that is used for the storage of the logs of your modmails.
1. Go to the [API-keys page](https://m3o.com/account/keys) and create a new API key. For security purposes, you might want to limit the scopes of your API key. You can do so, as long as the API-key you will be using for this project has access to database (*db*) and *file*.
1. Input your API key as the variable *m3oKey*.
1. Fill in the other variables. 
1. Install the app and run `/modmail setup` inside the server you set in the variables.
1. Done!

# FAQ
- I copied the API-key from M3O and it worked at first, but now I get an invalid API-key error!
> You probably copied the temporary API key that is only valid during that session. Generate a new API key at the [API-key page](https://m3o.com/account/keys) and change the key to that API key.

- My logs show `<undefined>` in the close message.
> You either have provided an invalid API key or you used the temporary API key as explained in the first FAQ. Regenerate your API key via the [API key page](https://m3o.com/account/keys) and try again.

- I want to delete the upload part of the logs
> We spent a lot of time implementing the logging. If you really want to remove it, you will have to figure out what parts of the code to delete yourself. It will be added in the future some time (probably).

- I want to have the modmail bot in multiple servers
> Due to the nature of modmail bots, we highly advise against using the bot in multiple servers, even after modifying it. We will not be providing any support for "multi-guild" uses.

# Notes
Unless you want to see the world burn, you should **not** try and run an *unmodified* version of this bot in multiple servers. I will guarantee you that it will not work as expected. If you want to run it in multiple servers, please make the necessary modifications that I was unable to make. In a future version, I might update it to work in multiple versions, but I cannot make any promises.

# Plans for the future
- Emoji support inside `.txt` file instead of filtering
- Make uploading logs optional
- Add a cancel deletion button
- Multi-guild support
- Notification when user send a new message
- Add support for `message.create`, which means that all messages get saved by default (very request intensive)
- A way to search for/in previous logs
- Thanks to *@Fatsack#0051* and *@Nintendo_bot#7518* for suggesting using threads. We will definetely look into it for the future!
- Support for multiple support roles

## Changelog
For all updates, please see below.

### Current version
1.0.8

### Version 1.0.8
> Added clearance of a kv-pair when installing the app, which allows a fresh install

### Version 1.0.7
> Fixed breaking change that occured in version `1.0.6`

### Version 1.0.6
> Added a check to delete kv-pairs for non-existing channels (that for example got manually deleted)

> Updated thumbnail

> Be aware that M3O updated their limits to a 1000 requests per month (compared to 100.000 before), which means that you might need to get a paid subscription to use all features.

### Version 1.0.5
> Modmail now sends a message when a user leaves the guild (requires `Server Members Intent` to be enabled inside the [Discord Developer Portal](https://file.coffee/u/nvqCZwSe8H_lTE.png))

### Version 1.0.4
> Added version checker (thanks to *ChilliHero* and *AkaNixon* for developing it!)

> Changed "timezone" of daily file to UTC

### Version 1.0.3
> Added checking for the right guild

> Additional debugging options

> Added error message for invalid API key

### Version 1.0.2
> Updated Readme with new FAQ

> Added a `console.log` for the `pushtofile` function, as that one is throwing some errors for users. 

### Version 1.0.1
> Pushed a fix for channels possibly not closing properly

### Version 1.0.0
> Initial release