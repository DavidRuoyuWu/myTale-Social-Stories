<template>
  <v-app>
    <div class="container">
      <form v-if="!formComplete">
        <h3>Reset Your Password</h3>
        <div class="input-field">
          <v-text-field label ="Email" v-model="email" />
        </div>
        <div v-if="isError">
          {{error}}
        </div>
        <v-btn text class="submit-btn" v-on:click='reset'>Send verification email</v-btn>
      </form>
      <div v-if="formComplete && !isError">
        An email with instructions has been sent to your email address, if it exists on our system.
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
        formComplete: false,
        isError: false,
        error: '',
      };
    },
    methods: {
      reset(e){
        firebase.auth().sendPasswordResetEmail(this.email)
          .then(
            user => {
              this.formComplete = user;
              this.formComplete = true;
            },
            err=> {
              this.isError = true;
              this.error = err.message
            },
          );
          e.preventDefault();
      },
    },
    created() {
    }
  }
</script>

<style scoped>
.register-btn{
  margin-left:640px
}
</style>