<template>
  <div>
    <v-app-bar
        app
        color="white"
      >

      <v-toolbar-title
      >Make Your Own <span class="font-weight-black">SOCIAL STORIES</span></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text href="index.html">Home</v-btn>
      <v-btn text href="dashboard.html" v-if="isVerified">Profile</v-btn>
      <v-btn text href="account.html" v-if="!isVerified">Login</v-btn>
      <v-btn text href="search_app.html">Search</v-btn>
      <v-btn text href="editor.html">Editor</v-btn>
      <v-btn text href="about.html">About</v-btn>

    </v-app-bar>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false,
      isVerified: false,
      currentUser: '',
      user: "Login",
      userLink: "account.html",
    };
  },
  created(){
    this.isLoggedIn = firebase.auth().currentUser
    if(firebase.auth().currentUser){
      this.isVerified = firebase.auth().currentUser.emailVerified
    }
  },
}
</script>

<style scoped> 

</style>
