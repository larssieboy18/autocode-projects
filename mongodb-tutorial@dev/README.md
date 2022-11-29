# MongoDB tutorial (read the README)
One of the most asked question in the [Autocode Discord server](https://discord.gg/STz5AxkEEp) is how you should store information. The most common answer would be to use the [built in Key-Value (KV) feature in Autocode](https://autocode.com/lib/utils/kv/).
While this definitely has some usecases, once your bot grows big, you will reach its limits (a maximum of 1024 records per account, 1 MB per record). Using an external database, like [MongoDB](mongodb.com/), can be the solution.

This app aims to be an example for how to interact with MongoDB from Autocode. All functions are located in `helpers/mongodb.js` and there are 4 commands (created upon installation using `autocode/self-deployed.js`) that will guide you through it.

If you have any questions (that are not answered in the README) about this app, feel free to send me a message inside the [Autocode Discord server](https://discord.gg/STz5AxkEEp) by either pinging me or sending me a DM. My Discord username is *@Lars.#0018*

# Note
Please please please, read the README (this document) completely. It is here for a reason. If your question is answered in the README and you ask it anyways, you automatically consent to being made fun of :)

# Uses
So what can this app and MongoDB actually mean for you? You can use the helper file in your own projects and then call the function, as shown in the example files. For example, if you want to add something to the database, you can look through the `add-pair.js` file.
If you have any questions about integrating MongoDB with your bot/other application, just send me a DM!

## `add-pair.js`
- Allows you to add a record with the inputted data. The data gets added with the following function: ```await mongodb.insertOne({tutorial: inputValue, addedBy: `${member.user.id}`});```
`inputValue` is the string you input using the command, tutorial is the set key for this pair. You can change this to anything you want (in theory). `addedBy` is a key to show you an example for a set value.


## `delete-pair.js`
- Allows you to delete a record. The data gets removed with the following function: ```await mongodb.deleteOne({tutorial: inputValue})```
`inputValue` will be the value of the key `tutorial` that you want to be removed.


## `find-pair.js`
- Allows you to retrieve a record with the function ```await mongodb.findMultiple({addedBy: `${inputUser}`});```
The example looks up all records that were added by the mentioned user.


## `update-pair.js`
- Allows you to update a record with the function ```await mongodb.updateOne({tutorial: oldValue},{tutorial: newValue});```
The first part of the function is the filter, which uses the same filter as `delete-pair.js` and `find-pair.js`. The new key/value-pairs that you provide will either overwrite existing data if a key already exists or create a new key/value-pair if that is not the case.

# MongoDB setup
This app requires you to have a MongoDB account. Create one and navigate to [the MongoDB website](https://cloud.mongodb.com). From there you need to create a cluster. Pick whichever you like, they will all work with this app.
After the creation of your cluster, you need to navigate to the Data API page. It is located on the sidebar on the left. 

![Sidebar preview](https://file.coffee/u/9Qdrr8JLI7T92j.png) 

On the enable Data API page, select your created cluster and click enable Data API key. 

## How to get the Environment Variables?
- `urlEndpoint`
Make sure to **NOT** include a `/` at the end.

> ![How to get URL endpoint](https://file.coffee/u/K2U4mWKSAu34H3.png)


- `apikey`

> ![How to get API key (step 1)](https://file.coffee/u/f1zX8KSvETCyQa.png)


> ![How to get API key (step 2)](https://file.coffee/u/y5ZxJyylvp_dCT.png)


> ![How to get API key (step 3)](https://file.coffee/u/wfd1i3F79CYWd7.png)


- `clusterName`

> ![How to get cluster name](https://file.coffee/u/v95enSPgBe7XoO.png)


- `databaseName`

> Any text! If the database does not yet exist, it will be created. Make sure to only include [a-Z] or `-`


- `collectionName`

> Any text! If the collection does not yet exist, it will be created. Make sure to only include [a-Z] or `-`

# Docs
For detailed documentation on MongoDB, you can read the docs [here](https://www.mongodb.com/docs/atlas/api/data-api).

Do you prefer to watch a video on how MongoDB works instead of reading through this text? Then you can watch the tutorial that MongoDB published: 
> [![MongoDB video tutorial](http://img.youtube.com/vi/46I0wZiTFi4/0.jpg)](https://www.youtube.com/watch?v=46I0wZiTFi4 "MongoDB Video Tutorial")

# FAQ
*None yet*

# Current version
1.0.4

## Changelog
### 1.0.4
> - Added forgotten comments

### 1.0.3
> - Removed leftover file
> - Removed small error in the validation of database/collection names

### 1.0.2
> - Added validation on database and collection names

### 1.0.1
> - Fixed small error in README

### 1.0.0
> Initial release