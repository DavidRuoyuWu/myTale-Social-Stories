//import firebase from 'firebase'
//import { commentsRef } from "@/firebaseConfig"
import { accountsRef } from "@/firebaseConfig"
import storyMixin from "@/mixins/storyMixin"
import {db} from "@/firebaseConfig"
import {tagsRef} from "@/firebaseConfig"

export default{
  methods:{
    getName(UID){
      var arr = []
      var name = "";
      const query = accountsRef.orderByKey();
      query.once('value')
        .then(function(snapshot){
          name = snapshot.val()[UID].name
          arr.push(name);
        })
      return arr;
    },
    getUserComments(UID){
      var arr = []
      const query = accountsRef.orderByKey();
      query.once('value')
        .then(function(snapshot){
          var commentsObj = snapshot.val()[UID].comments
          for(let key in commentsObj){
            arr.push(commentsObj[key])
          }
        })
      return arr;
    },
    getVarVals(UID){
      var arr = []
      const query = accountsRef.orderByKey();
      query.once('value')
        .then(function(snapshot){
          var profileObj = snapshot.val()[UID].profile
          for(let key in profileObj){
            arr.push(profileObj[key])
          }
        })
      return arr;
    },
    getVarNames(UID){
      var arr = []
      const query = accountsRef.orderByKey();
      query.once('value')
        .then(function(snapshot){
          var profileObj = snapshot.val()[UID].profile
          for(let key in profileObj){
            arr.push(key)
          }
        })
      return arr;
    },
    getStoriesWithDrafts(UID){
      var arr = []
      var storyObj = {}
      const query = accountsRef.orderByKey()
      query.once('value')
      .then(function(snapshot){
        var draftsObj = snapshot.val()[UID].drafts
        for(let key in draftsObj){
          storyObj[key] = snapshot.val()[UID].drafts[key]
        }
        arr.push(storyObj)
      })
      return arr;
    },
    getDraftsData(UID, title){
      var arr = []
      const query = accountsRef.orderByKey()
      query.once('value')
      .then(function(snapshot){
        var draftsObj = snapshot.val()[UID].drafts[title]
        for(let key in draftsObj){
          arr.push(draftsObj[key].dateUpdated)
        }
      })
      return arr;
    },
    removeStoryDrafts(storyTitle){
      if(confirm("Are you sure you want to delete this story?")){
        db.ref('accounts/' + this.userID + '/drafts/' + storyTitle).remove()
        location.reload()
      }
    },
    removeComment(commentKey, userID){
      if(confirm("Are you sure you want to delete this comment?")){
        location.reload()
        db.ref('accounts/' + userID + '/comments/' + commentKey).remove()
        db.ref('comments/'+ commentKey).remove()
      }
    },
    editComment(commentKey, userID, comment){
      if(comment.length <= 0){
        alert("Your comment is too short.")
      }
      else{
        var commentObj = {"comment": comment}
        if(db.ref('accounts/' + userID + '/comments/' + commentKey)){
          db.ref('accounts/' + userID + '/comments/' + commentKey).update(commentObj)
        }
        db.ref('comments/'+ commentKey).update(commentObj)
        this.editCommentKey = ''
        this.commentEdit = ''
        this.currentlyEditing = false
        location.reload()
      }
    },
    addTag(tag){
      var tagObj = {"tagName": tag}
      db.ref('tags/'+ tag).update(tagObj)
      this.addingTag = false
    },
    getTags(){
      var arr = []
      const query = tagsRef.orderByKey()
      query.once('value')
      .then(function(snapshot){
        var tagsObj = snapshot.val()
        for(let key in tagsObj){
          arr.push(key)
        }
      })
      return arr;
    }
  },
  mixins: [storyMixin]
}