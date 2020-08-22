const firebase = require('firebase')
require('firebase/firestore')

firebase.initializeApp({
  apiKey: "AIzaSyAu5EUOxMPPdrRrZo-hfQs19RDNaJ4mgR4",
  authDomain: "mytale-comments.firebaseapp.com",
  databaseURL: "https://mytale-comments.firebaseio.com",
  projectId: "mytale-comments",
  storageBucket: "mytale-comments.appspot.com",
  messagingSenderId: "320636559583",
  appId: "1:320636559583:web:a6c77ce3ebb26dfa48c96a",
  measurementId: "G-12RZEF9E3K"
});

var db = firebase.firestore()

var exampleStories = 

[
  {
    "title": "Doing Homework",
    "author": "Justin Wu",
    "synopsis": "This story is about how a child can go about doing homework in school. It shows how one can act when asking for help, and how one can act when helping others.",
    "tags": ["School", "Homework", "Friends", "Gratefulness", "Please", "Thanks", "Responsibility"],
    "views": 100,
    "dateNow": 1592957207463,
    "dateAdded": "2/22/2020",
    "creator": "justin.wu333@gmail.com"
  },
  {
    "title": "Getting Dressed",
    "author": "Lynne Wang",
    "synopsis": "Getting Dressed shows what difficulties you can encounter while getting dressed, and how to deal with them. It also shows the importance of getting dressed and changing clothes.",
    "tags": ["Responsibility", "Clothes", "Dressing", "Home"],
    "views": 37,
    "dateNow": 1592957207465,
    "dateAdded": "3/22/2020",
    "creator": "justin.wu333@gmail.com"
  },
  {
    "title": "My Cat",
    "author": "Grace Tian",
    "synopsis": "My Cat presents the perspective of a child who owns a pet cat. From napping to playing with yarn, this story is an example of what owning a cat looks like.",
    "tags": ["Pets", "Behavior", "Responsibility", "Home"],
    "views": 40,
    "dateNow": 1592957207467,
    "dateAdded": "4/22/2020",
    "creator": "justin.wu333@gmail.com"
  },
  {
    "title": "Playground",
    "author": "Vatsal Varma",
    "synopsis": "Playgrounds can be worrisome for parents, especially if their kid has never been to one. This story helps familiarize the concept of playgrounds, and how one should behave there.",
    "tags": ["Friends", "Playing", "Socializing", "Manners", "Behavior"],
    "views": 7,
    "dateNow": 1592957207469,
    "dateAdded": "05/22/2020",
    "creator": "justin.wu333@gmail.com"
  },
  {
    "title": "Saying Thank You In School",
    "author": "David Wu",
    "synopsis": "This story tells the story of Mike, an 8 year old who goes to school. Accompany Mike to school to see how he interacts with his friends, showing his gratitude and kindness along the way!",
    "tags": ["Saying Something", "Thanks", "Gratefulness", "Manners", "Behavior", "School"],
    "views": 1,
    "dateNow": 1592957207471,
    "dateAdded": "06/22/2020",
    "creator": "justin.wu333@gmail.com"
  },
  {
    "title": "School",
    "author": "David Wu",
    "synopsis": "How should I get ready for school? How should I act while I'm on the bus? What should I do in school? This story contains answers for all of these questions, and more!",
    "tags": ["School", "Friends", "Behavior", "Manners"],
    "views": 7,
    "dateNow": 1592957207469,
    "dateAdded": "05/22/2020",
    "creator": "wu.justin2000@gmail.com"
  },
  {
    "title": "Tragedies On Television",
    "author": "Grace Wu",
    "synopsis": "Tragedy can be something that children may be exposed to very early on, and it's important to know how to deal with tragedy. This story shows how a tragedy can usually happen, and a good way to deal with it.",
    "tags": ["Television", "Tragedy", "Home"],
    "views": 7,
    "dateNow": 1592957207469,
    "dateAdded": "05/22/2020",
    "creator": "wu.justin2000@gmail.com"
    },
  {
    "title": "Variable Tester",
    "author": "Vatsal Varma",
    "synopsis": "This story is an example of the appropriate way to test variables.",
    "tags": ["Variables", "Testing"],
    "views": 7,
    "dateNow": 1592957207469,
    "dateAdded": "05/22/2020",
    "creator": "wu.justin2000@gmail.com"
  }
]

exampleStories.forEach(function(obj){
  db.collection('stories').add({
    title: obj.title,
    author: obj.author,
    synopsis: obj.synopsis,
    tags: obj.tags,
    views: obj.views,
    dateNow: obj.dateNow,
    dateAdded: obj.dateAdded,
    creator: obj.creator
  }).then(function(docRef){
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error){
    console.error("Error adding document: ", error)
  })
})
