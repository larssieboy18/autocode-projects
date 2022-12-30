// // authenticates you with the API standard library
// const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// // sets variables
// if (!process.env.M3O_API_TOKEN)
  // console.error(
    // `You have not set a M3O API-key! This means that this file will not work.`
  // );
// const m3oKey = process.env.M3O_API_TOKEN;
// let {
  // channel_id,
  // guild_id,
  // user_id,
  // member,
  // self_video,
  // self_mute,
  // self_deaf,
  // mute,
  // deaf,
// } = context.params.event;

// // allows hashing for unique table names
// const hash = require('object-hash');
// let guild_variable = hash(guild_id).slice(0, 12);
// let tablename = `${guild_variable}_vcList`;

// if (channel_id !== null) {
  // // gets data from the db from the current user
  // let dataindb = (
    // await lib.http.request['@1.1.6'].post({
      // url: `https://api.m3o.com/v1/db/Read`,
      // authorization: `${m3oKey}`,
      // headers: {
        // 'Content-Type': `application/json`,
      // },
      // params: {
        // id: `${user_id}`,
        // table: `${tablename}`,
      // },
    // })
  // ).data.records;

  // console.log(dataindb);

  // // if not null (aka not left channel) and no data already existing in the database
  // // means just joined a channel
  // if (!dataindb[0]) {
    // console.log(`${member.user.username} joined a VC`);
    // let logtodb = await lib.http.request['@1.1.6'].post({
      // url: `https://api.m3o.com/v1/db/Create`,
      // authorization: `${m3oKey}`,
      // headers: {
        // 'Content-Type': `application/json`,
      // },
      // params: {
        // record: {
          // id: `${user_id}`,
          // username: `${member.user.username}`,
          // channel_id: `${channel_id}`,
          // timestamp_join: new Date().getTime(),
          // video_on: self_video,
          // muted: self_mute,
          // deafened: self_deaf,
          // server_muted: mute,
          // server_deafened: deaf,
        // },
        // table: `${tablename}`,
      // },
    // });
    // console.log(logtodb.data);
    // console.log(`Succesfully created a record in the database`);
    // /*
  // if channel id is not null and something is already in the database,
  // that means someone either (got server) muted/deafened, turned their video on or switched channel.
  // */
  // } else if (dataindb[0]) {
    // console.log(`${member.user.username} updated something in the VC`);
    // let logtodb = await lib.http.request['@1.1.6'].post({
      // url: `https://api.m3o.com/v1/db/Update`,
      // authorization: `${m3oKey}`,
      // headers: {
        // 'Content-Type': `application/json`,
      // },
      // params: {
        // record: {
          // id: `${user_id}`,
          // username: `${member.user.username}`,
          // channel_id: `${channel_id}`,
          // timestamp_join: dataindb[0].timestamp_join,
          // video_on: self_video,
          // muted: self_mute,
          // deafened: self_deaf,
          // server_muted: mute,
          // server_deafened: deaf,
        // },
        // table: `${tablename}`,
      // },
    // });
    // if (logtodb.statusCode == 200) {
      // console.log(`Succesfully updated the record in the database`);
    // } else {
      // console.error(
        // `An error occured while updating the record in the database`
      // );
      // console.lerror(logtodb);
    // }

    // // if channel id is null, that means they left the vc
  // } else if (channel_id == null) {
    // console.log(`${member.user.username} left the VC`);
    // let deletefromdb = await lib.http.request['@1.1.6'].post({
      // url: `https://api.m3o.com/v1/db/Delete`,
      // authorization: `${m3oKey}`,
      // headers: {
        // 'Content-Type': `application/json`,
      // },
      // params: {
        // id: `${user_id}`,
        // table: `${tablename}`,
      // },
    // });
    // if (deletefromdb.statusCode == 200) {
      // console.log(`Succesfully deleted record from the database`);
    // } else {
      // console.error(
        // `An error occured while deleting the record from the database`
      // );
      // console.error(deletefromdb);
    // }
  // }
// } else {
  // console.error(
    // `Something weird happened. Please report this to @Lars.#0018 in the Autocode Discord`
  // );
  // console.log(context.params.event);
// }
