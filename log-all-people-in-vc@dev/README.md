# Retrieve voice channel members

## Description
This app allows you to store and retrieve all people that are in a certain voice channel (VC) and information about a person's VC status.. It provides some examples on how you can retrieve the information. The possibilities are way broader than those examples and I cannot wait to see what you guys come up with!
Previously it was not possible to retrieve all people inside a voice channel, but by recreating a caching system you can achieve the same result!

To be clear: you have my permission to re-use (parts of) the code in any Autocode project you like! Made something amazing? Share it with the community!

For support, please ping *@Lars.#0018* in the Autocode Discord server or send him a DM.

# NOTE
This app might be a bit more complicated than others, which is why I advise you to read through the README.
If your question is answered in the README, I will refer you back to here.

# How does it work?
If you are not familiar with what caching is, I recommend you read about it at [Wikipedia](https://en.wikipedia.org/wiki/Cache_(computing)) or [Amazon's page](https://aws.amazon.com/caching/).

The app heavily relies on the `update.js` file, which registers all people joining and leaving voice channels. Based on their action, their data will either be written to a database or deleted from a database.
If someone switched voice channels, there data will be updated.

If you want to use the code in your own projects, make sure to keep the `update.js` file the same (or edit it if you understand it). You can use the other files as starting points for your projects.

## Provided examples and what they do:
- `invc.js`
> Shows you all the people in a certain voice channel when doing `/invc <channel>`
- `vc-status`
> Shows you the information the bot has stored for a specific user when doing `/vc-status <user>`

# Setup instructions
Install this app and fill in the Guild ID variable. The Guild ID variable is "required" for creating slash commands. They are not required for the base of the app to work and just make the examples work.

# FAQ
- How do I get all members of a specific VC and use it in my own project?
> Read through the `in-vc.js` file to see how getting data for a specific VC works.

- How do I get the VC of a specific user?
> Read through the `vc-status.js` file to see how getting data for a specific user works. 

# Changelog

### Current version
1.1.0

## Version 1.1.0
> Changed the app to work with kv-pairs instead of M3O, as M3O removed their free plan. The code is still there if you want to read through it, it will be removed in a future version.

## Version 1.0.1
> Optimized the code so that it uses less M3O requests.

## Version 1.0.0
> Initial release