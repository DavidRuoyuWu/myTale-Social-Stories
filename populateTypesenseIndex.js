const Typesense = require('typesense');

module.exports = (async () => {
  const typesense = new Typesense.Client({
    nodes: [
      {
        //host: 'localhost',
        host: 'vcm-15431.vm.duke.edu',
        port: '8108',
        protocol: 'https',
      },
    ],
    apiKey: 'YOYCpFLj9u412ihigstCer5Zs2StzptR'
  });

  const schema = {
    'name': 'stories',
    'fields': [
      { 'name': 'title', 'type': 'string' },
      { 'name': 'author', 'type': 'string' },
      { 'name': 'synopsis', 'type': 'string' },
      { 'name': 'tags', 'type': 'string[]', 'facet': true },
      { 'name': 'views', 'type': 'int32' },
      { 'name': 'dateNow', 'type': 'int64'},
      { 'name': 'dateAdded', 'type': 'string'},
      { 'name': 'text', 'type': 'string'},
      { 'name': 'creator', 'type': 'string'},
      { 'name': 'storyKey', 'type': 'string'},
    ],
    'default_sorting_field': 'views',

    };

  console.log('Populating index in Typesense');

  try {
    await typesense.collections("stories").delete();
    console.log("Deleting existing collection: stories")
  } catch (error) {
    // Do nothing
  }

  console.log('Creating schema: ');
  console.log(JSON.stringify(schema, null, 2));
  await typesense.collections().create(schema);

  console.log('Adding records: ');
  const stories = require('./data/stories.json')
  try {
    const returnData = await typesense
      .collections('stories')
      .documents()
      .createMany(stories);
    console.log(returnData);
    console.log('Done indexing.');

    const failedItems = returnData.items.filter(item => item.success === false);
    if (failedItems.length > 0) {
      throw new Error(
        `Error indexing items ${JSON.stringify(failedItems, null, 2)}`,
      );
    }

    return returnData;
  } catch (error) {
    console.log(error);
  }
})();
