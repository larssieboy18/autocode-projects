// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

try {
  await lib.discord.commands['@0.0.0'].create({
    name: 'add-pair',
    description: 'Add a new key-value pair to your database!',
    options: [
      {
        type: 3,
        name: 'value',
        description: 'The name of the value you want to store',
        required: true,
      },
    ],
  });
  console.log(`Succesfully created the add-pair command!`);
} catch (eAdd) {
  console.error(`Error creating the add-pair command!`);
  console.error(eAdd);
}

try {
  await lib.discord.commands['@0.0.0'].create({
    name: 'find-pair',
    description:
      'Find all key-value pairs that have been added by the provided user',
    options: [
      {
        type: 6,
        name: 'user',
        description: 'The user you want to look up',
        required: true,
      },
    ],
  });
  console.log(`Succesfully created the find-pair command!`);
} catch (eFind) {
  console.error(`Error creating the find-pair command!`);
  console.error(eFind);
}

try {
  await lib.discord.commands['@0.0.0'].create({
    name: 'update-pair',
    description: 'Update a key-value pair matching your filter!',
    options: [
      {
        type: 3,
        name: 'currentvalue',
        description: 'The value that the key currently has',
        required: true,
      },
      {
        type: 3,
        name: 'newvalue',
        description: 'The value that the key should be updated to',
        required: true,
      },
    ],
  });
  console.log(`Succesfully created the update-pair command`);
} catch (eUpdate) {
  console.error(`Error creating the update-pair command!`);
  console.error(eUpdate);
}

try {
  await lib.discord.commands['@0.0.0'].create({
    name: 'delete-pair',
    description: 'Delete a key-value pair matching your filter!',
    options: [
      {
        type: 3,
        name: 'value',
        description: 'The value of the kv-pair you want to delete',
        required: true,
      },
    ],
  });
  console.log(`Succesfully created the delete-pair command`);
} catch (eDelete) {
  console.error(`Error creating the delete-pair command!`);
  console.error(eDelete);
}
