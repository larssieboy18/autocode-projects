# Verification system
This app lets you create a verification system for new users. It will add the "Needs to verify" role to new users and force them to click a certain button before allowing them to use other channels.

# Features
- [x] 1 command setup
- [x] Optional time out feature to prevent non-verified users from spamclicking the buttons
- [x] Easy to use for users
- [x] Automatically creates channel, prompt and role
- [x] Makes sure new channels are also not visible for non-verified members
- [x] Every function is explained and commented, so you can see what the code does
- [x] Checks for already existing verification channels
- [x] Support for servers that use both a verified role and non-verified role and "just" a non-verified role

# Preview
![Prompt preview](https://file.coffee/u/YRoY-6uJ9FZr87.png)

# Set up instructions
Provide your guild ID in the Environment variables. This will allow the command to be automatically created. Alternatively, you can create the command yourself using [Autocode's command builder](https://autocode.com/tools/discord/command-builder/).
You will also need to provide the "freeze" time in the variables. This will allow the bot to block users from clicking all buttons until they get it right. If you don't want this feature, set the freeze time to `0`.

After the command has been created, run `/verification create` in the server that you want to set it up. It will then automatically create the verification role, channel and prompt.

To make sure people automatically get the non-verified role when they join your server, you are REQUIRED to have `Server Members Intent` enabled from inside the [Discord Developer Portal](https://discord.com/developers/applications). Go to your bot's page and enable it like so: ![Enable Intents](https://file.coffee/u/ka06_Ok5yOphXY.png)

There are 2 things you can configure. First off, if you have a staff role that should also have access to the `#verification` channel, you can do so by following the instructions in line 114 of the `verification.js` file (functions/events/discord/command/verification.js).
Moreover, you can add support for a verified role by going into the `success.js` file (functions/events/discord/message/button/verification/success.js) and following the instructions in line 24.

# FAQ
- I am getting an error about permissions
> First off, make sure your bot has `Manage roles` permissions. If that is the case, your verified and/or need to verify roles are `BELOW` the bot's role.
---


If you have any questions, ask *@Lars.#0018* in the Autocode Discord server.



Please do not  change the channelname of the channel that is created. Some of the code is dependent on the channelname being `#verification`. If you do want to change the name, be sure to change the name of that channel in the code as well. This mainly has an impact on the scheduler.