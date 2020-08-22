<template>
  <v-app class="blue-grey lighten-5">
    <div v-if="isVerified" class = 'user-profile'>
      <div class="py-3"></div>
      <v-card flat class="container">
        <v-card-title>
          Welcome back, {{this.userName}}
          <v-spacer></v-spacer>
          <v-btn small outlined v-on:click="logout">Logout</v-btn>
        </v-card-title>
      </v-card>

      <br>
      <v-card flat class="container">
        <v-card-title class="pb-0">My Stories</v-card-title>
        <v-list two-line>
          <v-row>
          <v-col v-for='story of myStories' v-bind:key="story['.key']" cols="12" md="6">
            <v-list-item class="storyEntry">
              <v-list-item-content class="pa-0">
                <router-link :to="{name: 'Story', params: {title:removeTitleSpaces(story.title), id: story.id}}" class="storyLinks">
                  <v-list-item-title>{{story.title}}</v-list-item-title>
                </router-link>
                <v-list-item-subtitle>Created on {{story.dateAdded}} Views: {{story.views}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        </v-list>
      </v-card>

      <br>
      <v-card flat class="container">
        <v-card-title class="pb-0">Story Drafts</v-card-title>
        <v-list two-line v-for='story of myStoryDrafts' v-bind:key="story['.key']">
          <v-list-item class="storyEntry" v-for='title of Object.keys(story)' v-bind:key="title['.key']">
            <v-list-item-content class="pa-0">
              <v-list-item-title>
                <strong>{{title}}</strong>
              </v-list-item-title>
              <v-list-item-subtitle>Updated on {{story[title].dateUpdated}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action class = "draft-actions">
              <v-btn title = "Edit Draft" icon v-on:click="goToEditor(story[title].text, story[title].OGstory)">
                <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-list-item-action>
            <v-list-item-action class = "draft-actions">
              <v-btn title = "Delete Draft" icon v-on:click="removeStoryDrafts(title)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>

          </v-list-item>
        </v-list>
      </v-card>

      <br>
      <v-card flat class="container">
        <v-card-title class="pb-0">My Comments</v-card-title>
        <v-list two-line>
          <v-list-item class= "comment" v-for='comment of myComments' v-bind:key="comment['.key']">
            <v-list-item-content v-if="!currentlyEditing || comment.commentKey !== editCommentKey">
              <v-list-item-title class="text-wrap">{{comment.comment}}</v-list-item-title>
              <v-list-item-subtitle>
                {{comment.storyTitle}} {{comment.dateAdded}}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action class = "comment-actions" v-if="!currentlyEditing || comment.commentKey !== editCommentKey">
              <v-btn title = "Edit Comment" icon v-on:click="confirmEdit(comment.commentKey, comment.comment)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action class = "comment-actions" v-if="!currentlyEditing || comment.commentKey !== editCommentKey">
              <v-btn title = "Remove Comment" icon v-on:click="removeComment(comment.commentKey, userID)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-content v-if="comment.commentKey === editCommentKey">
              <form class = "edit-comment">
                <v-text-field v-model="commentEdit" width="100%"></v-text-field>
                <v-btn class="mb-2" outlined small v-on:click="editComment(comment.commentKey, userID, commentEdit)">Submit</v-btn>
              </form>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <br>
      <userVariables :key="reloadKey" v-on:evtSaveVar="saveNewVar" v-on:evtSubmit="submitForm" 
        v-on:evtDelVar="deleteVar" />
      
      <div class="py-10"></div>
    </div>

    <div v-if="!isVerified" class = 'not-logged-in'>
      <p>Please log in or verify your account</p>
    </div>
    
  </v-app>
</template>

<script>
  import userVariables from '@/components/users/userVariables.vue'
  import firebase from 'firebase'
  import firebaseMixin from '@/mixins/firebaseMixin'
  import storyMixin from '@/mixins/storyMixin'

  export default {
    data() {
      return {
        userID: firebase.auth().currentUser.uid,
        userEmail: firebase.auth().currentUser.email,
        userName: firebase.auth().currentUser.displayName,
        myComments: [],
        myStories: [],
        myStoryDrafts: [],
        hasStories: false,
        isVerified: false,
        reloadKey: 0,
        editCommentKey: '',
        commentEdit: '',
        currentlyEditing: false,
      };
    },
    components: {
      userVariables
    },
    methods: {
      logout(){
        firebase.auth().signOut().then(() => {
          location.replace("account.html")
        })
      },
      submitForm(event){
        var userProfile = {};
        var i;
        for (i=0; i<event.profile.length; i++) {
          userProfile[event.varNames[i]] = event.profile[i];
        }
        var updates = {};
        updates['/accounts/' + firebase.auth().currentUser.uid + '/profile'] = userProfile;
        firebase.database().ref().update(updates);
        document.getElementById("formMsg").innerHTML = "Your story variables have been successfully updated.";
      },
      saveNewVar(event){
        // this.openNew = false;
        var userProfile = {};
        var i;
        for (i=0; i<event.profile.length; i++) {
          userProfile[event.varNames[i]] = event.profile[i];
        }
        userProfile[event.varName] = event.varVal;
        var updates = {};
        updates['/accounts/' + firebase.auth().currentUser.uid + '/profile'] = userProfile;
        firebase.database().ref().update(updates);
        this.reloadKey += 1;
      },
      deleteVar(event){
        if(confirm("Are you sure you want to delete this variable?")){
          var userProfile = {};
          var i;
          for (i=0; i<event.profile.length; i++) {
            userProfile[event.varNames[i]] = event.profile[i];
          }
          userProfile[event.varName] = null;
          var updates = {};
          updates['/accounts/' + firebase.auth().currentUser.uid + '/profile'] = userProfile;
          firebase.database().ref().update(updates);
          this.reloadKey += 1;
        }
      },
      getStoryDrafts(){
        var arr = []
        var storageRef = firebase.storage().ref(this.userEmail)
        storageRef.listAll().then(function(data){
          data.prefixes.forEach(function(folderRef){
            var draftObj = { 'name' : '', 'date': ''}
            draftObj.name = folderRef.name
            folderRef.listAll().then(function(child){
              child.items.forEach(function(tweeRef){
                tweeRef.getMetadata().then(function(metadata){
                  var updateDate = metadata.updated.substring(0,10);
                  updateDate = updateDate.substring(5,7) + '/' + updateDate.substring(8,10) + '/' + updateDate.substring(0,4);
                  draftObj.date = updateDate;
                  arr.push(draftObj)
                })
              })
            })
          })
        })
        return arr
      },
      goToEditor(storyTweeText, OGstoryText){
        sessionStorage.setItem("createTemplate", "");
        sessionStorage.setItem("OGstoryPassages", OGstoryText);
        sessionStorage.setItem("storyLocation", "");
        sessionStorage.setItem("storyContent", storyTweeText);

        const link = document.createElement('a');
        link.href = "editor.html";
        link.click();
        URL.revokeObjectURL(link.href);
      },
      confirmEdit(commentKey, comment){
        this.editCommentKey = commentKey;
        this.commentEdit = comment;
        this.currentlyEditing = true;
      }
    },
    created() {
      if(firebase.auth().currentUser){
        this.isVerified = firebase.auth().currentUser.emailVerified
      }
      this.myStories = this.retrieveUserStories(this.userEmail);
      this.myStoryDrafts = this.getStoriesWithDrafts(this.userID);
      this.myComments = this.getUserComments(this.userID);
      if(this.userName == null) {
        this.userName = firebase.auth().currentUser.email;
      }
    },
    mixins: [firebaseMixin, storyMixin]
  }
</script>

<style scoped>
.container {
  width: 80%;
 }
.storyEntry {
  min-height: 40px;
 }
.storyEntry .draft-actions{
  visibility: hidden;
}
.storyEntry:hover .draft-actions{
  visibility: visible;
}
.storyLinks {
  font-weight: bold;
  text-decoration: none;
  color: black;
 }
.storyLinks:hover {
  text-decoration: underline;
  color: #FB8C00;
 }
.comment .comment-actions{
  visibility: hidden;
}
.comment:hover .comment-actions{
  visibility: visible;
}
</style>