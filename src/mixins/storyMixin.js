import {firestoredb} from '../firebaseConfig'

export default{
  data(){
    return{
      Typesense: require('typesense'),
      client: '',
      stories:[],
    }
  },
  methods: {
    createClient(){
      this.client = new this.Typesense.Client({
        'nodes': [{
          //'host': 'localhost',
          'host': 'vcm-15431.vm.duke.edu',
          'port': '8108',
          'protocol': 'https',
        }],
        'apiKey': 'YOYCpFLj9u412ihigstCer5Zs2StzptR',
      });
    },
    addStory(newStory){
      this.createClient();
      const storeKey = firestoredb.collection('stories').doc().id;
      newStory.storyKey = storeKey;
      this.client.collections('stories').documents().create(newStory);
      firestoredb.collection('stories').doc(storeKey).set(newStory);
      this.isSubmitted = true;
    },
    removeStory(ID, storyKey){
      if(confirm("Are you sure you want to delete this story?")){
        this.createClient();
        this.client.collections('stories').documents(ID).delete();
        firestoredb.collection('stories').doc(storyKey).delete();
        this.isDeleted = true;
      }
    },
    async updateViews(id, title, author, synopsis, tags, views, dateNow, dateAdded, text, creator, storyKey) {
      
      this.createClient()
      const updatedViewsStory = { //This is the story that is added when the button is pressed
        "id": id,
        "title": title,
        "author": author,
        "synopsis": synopsis,
        "tags": tags,
        "views": views+1,
        "dateNow": dateNow,
        "dateAdded": dateAdded,
        "text": text,
        "creator": creator,
        "storyKey": storyKey,
      }
      
      try {
        await this.client.collections('stories').documents(id).delete();
        console.log("Deleting existing story.");
      } catch (error) {
        return;
      }
      
      try {
        await this.client.collections('stories').documents().create(updatedViewsStory).then(function (returnData) {
        console.log(returnData)});
      } catch (error) {
        console.log(error);
      }
    },
    getStory(ID){
      this.createClient();
      var storyHolder = [];
      this.client.collections('stories').documents(ID).retrieve().then(function(data){
        storyHolder.push(data);
      });
      return storyHolder
    },
    retrieveTitles() {
      this.createClient();
      var titleArray = [];
      this.client.collections('stories').documents().export().then(function(data){
        for(let key in data){
          titleArray.push(JSON.parse(data[key]).title)
        }
      });
      return titleArray;
    },
    retrieveStoryTags(storyTitle) {
      this.createClient();
      var tagArray = [];
      this.client.collections('stories').documents().export().then(function(data){
        for(let key in data){
          if(JSON.parse(data[key]).title === storyTitle){
            for(let tag in JSON.parse(data[key]).tags){
              tagArray.push(JSON.parse(data[key]).tags[tag]);
            }
          }
        }
      });
      return tagArray;
    },
    retrieveUserStories(userEmail){
      this.createClient();
      var storiesArray = [];
      this.client.collections('stories').documents().export().then(function(data){
        for(let key in data){
          if(JSON.parse(data[key]).creator === userEmail){
            storiesArray.push(JSON.parse(data[key]))
          }
        }
      });
      return storiesArray;
    },
    removeTitleSpaces(title){
      var replaced = title.split(" ").join("-");
      return replaced
    }
  }
}
