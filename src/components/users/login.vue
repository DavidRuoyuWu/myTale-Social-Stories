<template>
  <v-app>
    <div class="container">
      <form v-if="!isLoggedIn && !verifiedError">
        <h3>Login</h3>
        <div class="py-1"></div>
        <div class="input-field">
          <v-text-field id = "email" label="Email" v-model="email" />
          <v-text-field id = "password" type="password" label ="Password" v-model="password" />
        </div>
        <div v-if="isError">
          {{error}}
        </div>
        <v-btn text id = "login" class="login-btn" v-on:click='login'>Login</v-btn>
        <router-link :to="{name: 'resetPassword'}">
          <v-btn text class="reset-password">Forgot Password</v-btn>
        </router-link>
        <v-btn text class="register-btn" href="register.html">Create an account</v-btn>
      </form>
      <div v-if="verifiedError">
        <h3>Your account is not verified.</h3>
        <v-btn text class="verify-btn" v-on:click='verificationEmail'>Send Verification Email</v-btn>
      </div>
      <div v-if="isLoggedIn && !isError" class="after-register">
        <p>You are now logged in!</p>
      </div>
    </div>
  </v-app>
</template>

<script>
import firebase from 'firebase'

  export default {
    data() {
      return {
        email: '',
        password: '',
        isLoggedIn: false,
        verifiedError: false,
        isError: false,
        error: '',
      };
    },
    methods: {
      login(e){
        this.isError = false;
        this.verifiedError = false;
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              if(firebase.auth().currentUser.emailVerified){
                this.isLoggedIn = user
                location.replace("dashboard.html")
              }
              else{
                this.verifiedError = true;
              }
            },
            err=> {
              this.isLoggedIn = false;
              this.isError = true;
              this.error = err.message
            },
          );
          e.preventDefault();
      },
      verificationEmail(e){
        firebase.auth().currentUser.sendEmailVerification()
        e.preventDefault();
      },
      listenForEnter(){
        var passwordInput = document.getElementById("password");
        passwordInput.addEventListener("keyup", 
        function(event) {
          if(event.keyCode === 13){
            event.preventDefault()
            document.getElementById('login').click();
          }
        })
      }
    },
    created() {
      //this.listenForEnter()
    }
  }
</script>

<style scoped>
.register-btn{
  float:right;
}
.reset-password{
  text-align:center;
}
a{
  text-decoration:none;
}
</style>