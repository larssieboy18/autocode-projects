const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let {apiKey, clusterName, databaseName, collectionName, urlEndpoint} =
  process.env;
// check the database/collection names to see if they are valid
if (databaseName.match(/[^a-z--]/i) || collectionName.match(/[^a-z--]/i)) {
  // https://www.mongodb.com/docs/manual/reference/limits/#naming-restrictions
  return console.error(
    `Your database and collection names cannot include any spaces or special characters. Please adjust them inside the environment variables.`
  );
}
if (
  databaseName.length < 1 ||
  databaseName.length > 64 ||
  collectionName.length < 1 ||
  collectionName.length > 64
) {
  return console.error(
    `Your database and collection need to have names of less than 64 characters and cannot be empty. Please adjust them inside the environment variables`
  );
}

/*
Additional documentation: https://www.mongodb.com/docs/atlas/api/data-api-resources/
Video tutorial: https://www.youtube.com/watch?v=46I0wZiTFi4 >> https://gist.github.com/johnlpage/2e8bd55ed195cccd4af7cea718f1c640
*/

module.exports = {
  findOne: async (filter = {}) => {
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/#find-a-single-document
    let apicall = await lib.http.request['@1.1.6'].post({
      url: urlEndpoint + '/action/findOne',
      headers: {
        'Content-Type': `application/json`,
        'Access-Control-Request-Headers': `*`,
        'api-key': apiKey,
      },
      params: {
        dataSource: clusterName,
        database: databaseName,
        collection: collectionName,
        filter: filter, // https://www.mongodb.com/docs/manual/tutorial/query-documents/
      },
    });
    //console.log(apicall);
    if (apicall.data.document) {
      return apicall.data.document;
    } else {
      return {};
    }
  },
  findMultiple: async (filter = {}, limit = 0, sort = {}) => {
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/#find-multiple-documents
    if (limit == 0) limit = 50000;
    let apicall = await lib.http.request['@1.1.6'].post({
      url: urlEndpoint + '/action/find',
      headers: {
        'Content-Type': `application/json`,
        'Access-Control-Request-Headers': `*`,
        'api-key': apiKey,
      },
      params: {
        dataSource: clusterName,
        database: databaseName,
        collection: collectionName,
        sort: sort, // https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/
        limit: limit,
        filter: filter, // https://www.mongodb.com/docs/manual/tutorial/query-documents/
      },
    });
    console.log(apicall);
    if (apicall.data.documents) {
      return apicall.data.documents;
    } else {
      return [];
    }
  },
  updateOne: async (filter, changes, upsert = false) => {
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/#update-a-single-document
    let apicall = await lib.http.request['@1.1.6'].post({
      url: urlEndpoint + '/action/updateOne',
      headers: {
        'Content-Type': `application/json`,
        'Access-Control-Request-Headers': `*`,
        'api-key': apiKey,
      },
      params: {
        dataSource: clusterName,
        database: databaseName,
        collection: collectionName,
        filter: filter, // https://www.mongodb.com/docs/manual/tutorial/query-documents/
        upsert: upsert,
        update: {
          // https://www.mongodb.com/docs/manual/tutorial/update-documents/
          $set: changes,
        },
      },
    });
    //console.log(apicall);
    return apicall.data;
  },
  unsetOne: async (filter, changes) => {
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/#update-a-single-document
    let apicall = await lib.http.request['@1.1.6'].post({
      url: urlEndpoint + '/action/updateOne',
      headers: {
        'Content-Type': `application/json`,
        'Access-Control-Request-Headers': `*`,
        'api-key': apiKey,
      },
      params: {
        dataSource: clusterName,
        database: databaseName,
        collection: collectionName,
        filter: filter, // https://www.mongodb.com/docs/manual/tutorial/query-documents/
        update: {
          // https://www.mongodb.com/docs/manual/tutorial/update-documents/
          $unset: changes,
        },
      },
    });
    //console.log(apicall);
    return apicall.data;
  },
  deleteOne: async (filter) => {
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/#delete-a-single-document
    let apicall = await lib.http.request['@1.1.6'].post({
      url: urlEndpoint + '/action/deleteOne',
      headers: {
        'Content-Type': `application/json`,
        'Access-Control-Request-Headers': `*`,
        'api-key': apiKey,
      },
      params: {
        dataSource: clusterName,
        database: databaseName,
        collection: collectionName,
        filter: filter, // https://www.mongodb.com/docs/manual/tutorial/query-documents/
      },
    });
    //console.log(apicall);
    return apicall.data;
  },
  insertOne: async (record) => {
    // https://www.mongodb.com/docs/atlas/api/data-api-resources/#insert-a-single-document
    let apicall = await lib.http.request['@1.1.6'].post({
      url: urlEndpoint + '/action/insertOne',
      headers: {
        'Content-Type': `application/json`,
        'Access-Control-Request-Headers': `*`,
        'api-key': apiKey,
      },
      params: {
        dataSource: clusterName,
        database: databaseName,
        collection: collectionName,
        document: record, // make sure document is inside quotes
      },
    });
    //console.log(apicall);
    return apicall.data;
  },
};
