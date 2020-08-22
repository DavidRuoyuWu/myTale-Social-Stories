<template>
  <v-app>
    <NavBar />
    <v-main>
      <div id="content">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>

</template>

<script>

import NavBar from '@/components/homepage/NavBar'
import stateManager from "@/mixins/StateManager.js"

export default {
  title: 'MyTale - Make Your Own Social Stories',
  components:{
    NavBar,
  },
  data(){
    return{

    }
  },
  created(){
    if(this.storageAvailable("sessionStorage")){
      console.log("SESSION STORAGE EXISTS");
      this.$store.commit("updateDirectory", {searchLocation: sessionStorage.getItem("storyLocation")});
      this.$store.commit("updateContent", {content: sessionStorage.getItem("storyContent")});
    } else {
      console.log("NO SESSION STORAGE");
    }
  },
  mixins: [stateManager]
  
}
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
  }
</style>
