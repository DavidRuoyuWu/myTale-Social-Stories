<template>
  <v-app>
    <NavBar />
    <form v-if="!isSubmitted && !noStory">
      <h2>Add a New Story</h2>
      <v-text-field
        v-model="newStory.title"
        :error-messages="nameErrors"
        :counter="30"
        label="Story Title"
        required
      />
      <v-text-field
        v-model="newStory.synopsis"
        :error-messages="bodyErrors"
        label="Synopsis"
        required
      />
      <v-select
        v-model="newStory.tags"
        :items="allTags"
        :multiple="true"
        :error-messages="selectErrors"
        label="Tags"
        required
      />

      <v-text-field
        v-model="newTag"
        label="Add New Tag"
        required
        v-on:click="clickAddTag()"
      />

      <v-btn v-if="addingTag" :disabled="!addedTag" v-on:click="addTag(newTag), updateTags()">Add Tag</v-btn>
      <br>
      <v-btn :disabled="!formComplete" v-on:click="addStory(newStory)">Submit Story</v-btn>
    </form>
    <h2 v-if="noStory">No story has been chosen, please choose a story to submit.</h2>
    <h2 v-if="isSubmitted">Your story has been submitted!</h2>
  </v-app>
</template>

<script>

import NavBar from '@/components/homepage/NavBar';
import storyMixin from "@/mixins/storyMixin";
import firebaseMixin from "@/mixins/firebaseMixin";
import firebase from 'firebase';

//const allTags = ["Saying Something", "Apologizing", "Manners", "Friends", "Playing", "Thank You", "Apologizing"];
var d = new Date();

export default {
  components:{
    NavBar,
  },
  data (){
    return{
      allTags: [],
      newStory:{
        "title": "",
        "author": firebase.auth().currentUser.displayName,
        "synopsis": "",
        "tags": [],
        "views": 0,
        "dateNow": Date.now(),
        "dateAdded": d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear(),
        "text": "",
        "creator": firebase.auth().currentUser.email,
      },
      nameErrors:"",
      bodyErrors:"",
      authorErrors:"",
      selectErrors:"",
      newTag: "",
      noStory: false,
      isSubmitted: false,
      addingTag: false,
    }
  },
  methods: {
    clickAddTag(){
      this.addingTag = true;
    },
    updateTags(){
      this.allTags = this.getTags()
    }
  },
  created() {
    this.newStory.text = this.$store.state.storyToPublish;
    if(this.newStory.text.length === 0){
      this.noStory = true;
    }
    this.allTags = this.getTags()
  },
  mounted() {
  
  },
  computed:{
    formComplete () {
      if(this.newStory.tags.length > 0 && this.newStory.title.length<=30){
        return this.newStory.title && this.newStory.author && this.newStory.synopsis && this.newStory.text
      } 
      else{
        return false
      }
    },
    addedTag(){
      return (this.newTag.length > 0)
    },
  },
  mixins: [storyMixin, firebaseMixin]
}
</script>

<style scoped>
form{
  margin-left: 30px;
  margin-right: 30px;
}
#content {
    font-family: Verdana, Geneva, sans-serif;
    line-height: 1.8;
    background-color: ivory;
  }
</style>
