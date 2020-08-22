<template>
  <v-app>
    <NavBar v-if = "showTop"/>
    <header class="font-weight-light" id="title" v-if="showTop">
      STORY EDITOR
    </header>
    <!--<editor v-on:evtGoFull="goFull" v-on:evtExitFull="exitFull"></editor>-->
    <router-view v-on:evtGoFull="goFull" v-on:evtExitFull="exitFull"></router-view>

  </v-app>
</template>

<script>
//import Editor from "@/components/editor/Editor.vue";
import NavBar from "@/components/homepage/NavBar.vue";
import stateManager from "@/mixins/StateManager.js";


export default {
  name: "Editor",
  title: 'MyTale - Make Your Own Social Stories',

  components: {
    //editor: Editor,
    NavBar,
  },

  data() {
    return {
      showTop: true,
    };
  },

  methods:{
    goFull: function(){
      this.showTop = false;
    },

    exitFull: function(){
      this.showTop = true;
    }
  },

  mixins: [stateManager],

  /*
   * Created and beforeDestroy lifecycle hooks manage the vuex state of the website across multiple pages
   * Required for proper functionality.
   */

  created: function(){
    if(this.storageAvailable("sessionStorage")){
      console.log("SESSION STORAGE EXISTS: " + sessionStorage.getItem("storyLocation"));
      this.$store.commit("updateDirectory", {searchLocation: sessionStorage.getItem("storyLocation")});
      this.$store.commit("updateContent", {content: sessionStorage.getItem("storyContent")});
    } else {
      console.log("NO SESSION STORAGE");
    }
  },
  
};
</script>

<style scoped>

  * {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
  }

  #title {
    background: #FFA726;
    text-align: center;
    padding: 36px 10px;
    margin-top: 8vh;
    font-family: Roboto, sans-serif;
    font-size: 36px;
    letter-spacing: 2px;
    height: 18vh;
  }

  .v-application >>> .v-app-bar  {
    height: 8vh !important;
  }

  .v-application >>> .v-toolbar__content  {
    height: 8vh !important;
  }

  v-content {
    font-family: Verdana, Geneva, sans-serif;
    line-height: 1.8;
  }


</style>
