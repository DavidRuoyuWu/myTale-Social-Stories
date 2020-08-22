import {initializeApp} from 'firebase'

const app =  initializeApp({
  apiKey: "AIzaSyAu5EUOxMPPdrRrZo-hfQs19RDNaJ4mgR4",
  authDomain: "mytale-comments.firebaseapp.com",
  databaseURL: "https://mytale-comments.firebaseio.com",
  projectId: "mytale-comments",
  storageBucket: "mytale-comments.appspot.com",
  messagingSenderId: "320636559583",
  appId: "1:320636559583:web:a6c77ce3ebb26dfa48c96a",
  measurementId: "G-12RZEF9E3K"
});

export const db = app.database()
export const firestoredb = app.firestore()
export const commentsRef = db.ref('comments')
export const accountsRef = db.ref('accounts')
export const tagsRef = db.ref('tags')

