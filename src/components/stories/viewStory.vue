<template>
  <div>
    <img id="story">
  </div>
</template>

<script>
import storyMixin from "../../mixins/storyMixin"
import Axios from 'axios'
//import browserEditorMixin from "../../mixins/browserEditorMixin"

export default {
  data (){
    return{
      storyID: '',
      storyHTMLDirectory: '',
      givenStory: {},

    }
  },
  methods: {
    browserView(storyHTML){
      Axios.get(storyHTML).then(response => {
        var linkBlob = new Blob([response.data], {type: "text/html"});
        var imageURL = URL.createObjectURL(linkBlob);
        document.querySelector("#story").src = imageURL;
      });
    },
  },
  created(){
    this.storyID = this.$route.params.id;
    this.storyHTMLDirectory = this.$route.params.storyHTML
    this.browserView(this.storyHTMLDirectory);
  },
  mixins: [storyMixin]
}
</script>

<style scoped>

</style>
