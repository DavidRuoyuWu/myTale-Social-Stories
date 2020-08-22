<template>
  <v-card flat class="container">
    <v-card-title>My Story Variables</v-card-title>
    <v-card-text>
      <v-form>
        <v-row v-for="n in myProfile.length" :key="n['.key']">
          <v-col class="pt-0 pb-0" cols="11">
            <v-text-field :label="myVarNames[n-1]" v-model="myProfile[n-1]">
            </v-text-field>
          </v-col>
          <v-col class="pt-0 pb-0 mt-5" cols="1">
            <v-btn icon small @click="emitDelVar(n)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-col>
        </v-row>

        <v-btn outlined @click="openNew = !openNew">Add New Variable</v-btn>

        <v-row v-if="openNew" class="newVar">
          <v-col cols=5.5>
            <v-text-field label="Name" v-model="newVarName"></v-text-field>
          </v-col>
          <v-col cols=5.5>
            <v-text-field label="Value" v-model="newVarVal"></v-text-field>
          </v-col>
          <v-col cols=1>
            <v-btn outlined fab small @click="emitSaveVar">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <br>
        <v-btn outlined class="mt-2" @click="emitSubmit">Save</v-btn>
        <div id="formMsg"></div>
      </v-form>
    </v-card-text>
  </v-card>
</template>


<script>
	import firebase from 'firebase'
  import firebaseMixin from '@/mixins/firebaseMixin'

	export default {
		data() {
			return {
				userID: firebase.auth().currentUser.uid,
				myVarNames: [],
				myProfile: [],
				openNew: false,
				newVarName: '',
				newVarVal: '',
			};
		},

		methods: {
			emitSaveVar() {
				this.$emit("evtSaveVar", {varName: this.newVarName, varVal: this.newVarVal, varNames: this.myVarNames, profile: this.myProfile});
			},
			emitSubmit() {
				this.$emit("evtSubmit", {varNames: this.myVarNames, profile: this.myProfile});
			},
      emitDelVar(n) {
        this.$emit("evtDelVar", {varName: this.myVarNames[n-1], varNames: this.myVarNames, profile: this.myProfile});
      }
		},

		created() {
			if(firebase.auth().currentUser){
        this.isVerified = firebase.auth().currentUser.emailVerified
      }
      this.myVarNames = this.getVarNames(this.userID);
      this.myProfile = this.getVarVals(this.userID);
		},
		mixins: [firebaseMixin]
	}
</script>


<style scoped>
	
</style>
