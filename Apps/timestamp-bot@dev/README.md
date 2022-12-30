# Timestamp generator
Because Jacklyn never uses Timestamps, I decided to write a bot for it :) Users will be able to do `/timestamp <YYYY/MM/DD> <HH:MM[:SS]> <format> [offset]` to get the timestamp of that specific moment.

# NOTE
M3O cancelled their free services, so the timezone command will not work without a paid subscription to M3O.

# Features
- Makes using Discord timestamps much easier to use
- Hopefully encourages [Jacklyn](https://discord.com/channels/831185301900230696/935317922572828702/947904857141035068) to use Timestamps
- Promotes Blahaj

# Commands
- `/timestamp <YYYY/MM/DD> <HH:MM[:SS]> <format> [offset]`
> Returns the inputted time in a timestamp format. Both the actual timestamp and a codeblock will be shown so it can be easily copied.
> - `YYYY` - year (4 digits)
> - `MM` - month (2 digits)
> - `DD` - day (2 digits)
> - `HH` - hours (2 digits)
> - `MM` - minutes (2 digits)
> - `SS` - seconds (2 digits)
> - `format` - choose one of the available options
> - `offset` - a number between `-12` up to `12`. Defines the time difference between UTC and the timezone.

- `/timezone <city>`
> Because the offset of a timezone might not be inuitive, this app also provides a command for users to get more information about a certain timezone, including the offset of that timezone.
> Be aware that this requires an M3O API key, which you can retrieve from [M3O's API page](https://m3o.com/account/keys).


# Set up instructions
1. Provide the guild ID and set M3O key to `0`, unless you want to use `/timezone <city>`.
1. (*Optional*) provide the M3O API key which you can get from which you can retrieve from [M3O's API page](https://m3o.com/account/keys).
1. Install the app and enjoy the commands!

# Preview
![GIF preview](https://file.coffee/u/XeRAfClyCx07si.gif)

![Timezone preview](https://file.coffee/u/lnNnUxPMqvJS6E.png)

# FAQ
*None yet.*
If you have any questions, ask *@Lars.#0018* in the Autocode Discord server.