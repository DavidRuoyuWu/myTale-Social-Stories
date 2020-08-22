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

var firestoredb = firebase.firestore()
var storyArray = [];

firestoredb.collection('stories').get().then(querySnapshot => 
  {
    querySnapshot.forEach(story => {
      storyArray.push(story.data())
    })
  })
console.log(storyArray)