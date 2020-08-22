<template>
  <div>
    <form>
      <v-text-field
        v-model="newComment.comment"
        v-if="!commentChecker"
        :disabled="isSubmitted"
        label="Add a comment..."
        required
      />
      <button class="button" :disabled="!commentComplete" v-if="!commentChecker" v-on:click="getTags()">Next</button>
    </form>
    <div id="second-form">
      <form>
      <v-select
        v-model="newComment.helpfulTags"
        v-if="commentChecker"
        :items="tagsInStory"
        :disabled="isSubmitted"
        :multiple="true"
        label="Tags that you found were well-represented in this story"
        required
      />
      <button class="button" :disabled="!tagsComplete" v-if="commentChecker && !isSubmitted" v-on:click="post()">Comment</button>
      <p v-if="isSubmitted">Thank you for commenting!</p>
      </form>
    </div>
  </div>
</template>

<script>

import storyMixin from "@/mixins/storyMixin"
import firebase from 'firebase'
import firebaseMixin from "@/mixins/firebaseMixin"
import { db } from "@/firebaseConfig"

var d = new Date();

export default {
  props: ['givenStoryTitle'],
  data (){
    return{
      newComment: {
        "storyTitle": '',
        "name": '',
        "email": '',
        "comment": '',
        "dateNow": Date.now(),
        "dateAdded": d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear(), 
        "helpfulTags": [],
        "commentKey":'',
      },
      isSubmitted: false,
      nameArray:[],
      commentChecker: false,
      tagsInStory: [],
    }
  },
  computed: {
    commentComplete () {
      return this.newComment.comment && this.newComment.storyTitle
    },
    tagsComplete(){
      if(this.newComment.helpfulTags.length > 0){
        return true
      }
      return false
    }
  },
  methods: {
    getTags(){
      this.tagsInStory = this.retrieveStoryTags(this.newComment.storyTitle)
      this.commentChecker = true;
    },
    post(){
      var newKey = db.ref().push().key;
      this.newComment.commentKey = newKey
      db.ref('accounts/'+firebase.auth().currentUser.uid + '/comments/' + newKey).update(this.newComment);
      db.ref('comments/' + newKey).update(this.newComment)
      this.isSubmitted = true;
    },
  },
  created() {
    this.newComment.storyTitle = this.givenStoryTitle;
    if(firebase.auth().currentUser){
      this.newComment.name = firebase.auth().currentUser.displayName
      this.newComment.email = firebase.auth().currentUser.email
    }
  },
  mixins: [storyMixin, firebaseMixin],
}
</script>

<style scoped>
</style>
