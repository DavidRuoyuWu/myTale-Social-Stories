<template>
  <div v-if="givenStory[0]">
    <v-card flat class="container" v-if="!isDeleted">
      <v-card-title v-if="givenStory" class="display-1">
        {{givenStory[0].title}} 
        <v-spacer></v-spacer>
        <v-btn outlined v-on:click="updateViewsBrowser(givenStory[0])">View in Browser</v-btn>
        <v-btn outlined class="ml-2" v-on:click="updateViewsEditor(givenStory[0])">Edit Story</v-btn>
        <v-btn outlined class="ml-2" v-if="givenStory[0].creator === userEmail" v-on:click="removeStory(givenStory[0].id, givenStory[0].storyKey)">Delete Story</v-btn>
        
      </v-card-title>

        <v-card-subtitle>
        by {{givenStory[0].author}}
        <v-spacer></v-spacer>
        Created on {{givenStory[0].dateAdded}} | {{givenStory[0].views}} views
      </v-card-subtitle>

      <v-card-title>Synopsis</v-card-title>
      <v-card-text>{{givenStory[0].synopsis}}</v-card-text>
      
      <v-card-actions>
        <v-chip class="ml-2">
          <v-icon small>mdi-tag</v-icon> Tags
        </v-chip>
        <v-chip class="ml-2" color="orange" text-color="white" v-for="tag of givenStory[0].tags" v-bind:key="tag['.key']">
          {{tag}}
        </v-chip>
      </v-card-actions>

      <v-list two-line>
        <v-card-title class="pb-0">Comments</v-card-title>
        <div v-for="comment of storyComments" v-bind:key="comment['.key']">
          <v-list-item class= "comment" v-if="comment.storyTitle === givenStory[0].title">
            <v-list-item-content v-if="!currentlyEditing || comment.commentKey !== editCommentKey">
              <v-list-item-title class="text-wrap">{{comment.comment}}</v-list-item-title>
              <v-list-item-subtitle>
                {{comment.name}} {{comment.dateAdded}}
              </v-list-item-subtitle>
            </v-list-item-content>  
            
            <v-list-item-action class = "comment-actions" v-if="!currentlyEditing || comment.commentKey !== editCommentKey">
              <v-btn title = "Edit Comment" icon v-if="userEmail === comment.email" v-on:click="confirmEdit(comment.commentKey, comment.comment)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action class = "comment-actions" v-if="!currentlyEditing || comment.commentKey !== editCommentKey">
              <v-btn title = "Remove Comment" icon v-if="userEmail === comment.email" v-on:click="removeComment(comment.commentKey, userID)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-content v-if="comment.commentKey === editCommentKey">
              <form class = "edit-comment">
                <v-text-field v-model="commentEdit"></v-text-field>
                <v-btn class="mb-2" outlined small v-on:click="editComment(comment.commentKey, userID, commentEdit)">Submit</v-btn>
              </form>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>

      <v-card-text class="pt-1">
        <v-btn outlined small @click="showAddComment = true">Add Comment</v-btn>
        <div class="add-comment" v-if="showAddComment">
          <addComment v-if="isVerified" v-bind:givenStoryTitle = "givenStory[0].title" />
          <p v-if="!isLoggedIn"> You need to log in to comment</p>
        </div>
      </v-card-text>
    </v-card>

    <!--<h3>Ratings for Tags:</h3>
    <div v-for="(object,i) in tagsData" :key="i">
      <ul v-for="(tag,i) in object[givenStory[0].title]" :key="i">
        <li>
          {{tag[0]}}: {{tag[1]}}
        </li>
      </ul>
    </div>-->

    <h3 v-if="isDeleted">This story has been deleted!</h3>
  </div>
</template>

<script>
import firebase from 'firebase'
import storyMixin from "@/mixins/storyMixin"
import firebaseMixin from "@/mixins/firebaseMixin"
import browserEditorMixin from "@/mixins/browserEditorMixin"
import { commentsRef } from "@/firebaseConfig"
import addComment from '@/components/comments/addComments.vue' 

export default {
  name: 'Story',
  components:{
    addComment,
  },
  data (){
    return{
      storyID: '',
      tagsData:[],
      givenStory:[{}],
      storyComments: [],
      givenStoryComments: [],
      isLoggedIn: false,
      isVerified: false, 
      showAddComment: false,
      isMyComment: false,
      userEmail: '',
      userID: '',
      editCommentKey: '',
      commentEdit: '',
      currentlyEditing: false,
      isDeleted: false,
    }
  },
  firebase:{
    storyComments: commentsRef,
  },
  methods: {
    populateTagsObj(){
      var arr = []
      var keys = {}
      const query = commentsRef.orderByKey();
      query.once('value')
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.val().storyTitle;
            if(typeof keys[key] === "undefined"){
              keys[key] = {}
            }
            childSnapshot.val().helpfulTags.forEach(function(tag) {
              if(typeof keys[key][tag] === "undefined"){
                keys[key][tag] = 0;
              }
              keys[key][tag] += 1;
            })
          })
          for(let key in keys){
            keys[key] = Object.entries(keys[key])
            keys[key].sort(function(a,b){
              return b[1]-a[1]
            })
            if(keys[key].length>3){
              keys[key] = keys[key].slice(0,3)
            }
          }
          arr.push(keys)
        })
      return arr;
    },
    showAdd() {
      this.ShowAddComments = true;
    },
    confirmEdit(commentKey, comment){
      this.editCommentKey = commentKey;
      this.commentEdit = comment;
      this.currentlyEditing = true;
    },
  },
  async created(){
    if(firebase.auth().currentUser){
      this.isVerified = firebase.auth().currentUser.emailVerified
      this.isLoggedIn = firebase.auth().currentUser;
      this.userEmail = firebase.auth().currentUser.email;
      this.userID = firebase.auth().currentUser.uid;
    }
    this.tagsData = this.populateTagsObj();
    this.storyID = this.$route.params.id;
    this.givenStory = await this.getStory(this.storyID)

  
  },
  mixins: [storyMixin, browserEditorMixin, firebaseMixin],
}
</script>

<style scoped>
.comment .comment-actions{
  visibility: hidden;
}
.comment:hover .comment-actions{
  visibility: visible;
}
</style>
