<template>
  <v-app>
  <div class="container">
    <form v-if="!isRegistered">
      <h3>Register</h3>
      <div class="input-field">
        <v-text-field label="Your Name" v-model="newAccount.name" />
        <v-text-field label="Email" v-model="newAccount.email" />
        <v-text-field type="password" label ="Password" v-model="accountPassword" />
        <v-text-field type="password" label ="Re-enter password" v-model="passwordChecker" />
      </div>
      <div v-if="isError" class="error-message">
        {{error}}
      </div>
      <v-btn text class="button" v-on:click ='register'>Register</v-btn>
    </form>
    <div v-if="isRegistered && !isError" class="after-register">
      Thank you for registering. Please verify your email before logging in!
    </div>
  </div>
</v-app>
</template>

<script>

import firebase from 'firebase'
import {db} from "@/firebaseConfig"

export default {
  data() {
    return {
      newAccount: {
        name: '',
        email: '',
        profile: {},
      },
      accountPassword: '',
      passwordChecker: '',
      isRegistered: false,
      error: '',
      isError: false,
    };
  },
  methods: {
    register(e) {
      this.isError = false;
      if(this.accountPassword === this.passwordChecker && this.accountPassword.length>5){
        firebase.auth().createUserWithEmailAndPassword(this.newAccount.email, this.accountPassword)
        .then(
          user => {
            firebase.auth().currentUser.sendEmailVerification()
            firebase.auth().currentUser.updateProfile({
              displayName: this.newAccount.name
            })
            this.newAccount.profile['age'] = ''
            this.newAccount.profile['hometown'] = ''
            this.newAccount.profile['favoriteActivity'] = ''
            db.ref('accounts/'+firebase.auth().currentUser.uid).update(this.newAccount)
            this.isRegistered = user
          },
          err => {
            this.isRegistered = false;
            this.isError = true;
            this.error = err.message;
          }
        )
        e.preventDefault();
      }
      else if (this.accountPassword !== this.passwordChecker){
        this.isError = true;
        this.error = "Passwords have to match"
        e.preventDefault();
      }
      else if(this.accountPassword.length<6){
        this.isError = true;
        this.error = "Password has to be at least six characters"
        e.preventDefault();
      }
    }
  },
}
</script>

<style scoped>
  form {
    width: 80%;
  }
</style>