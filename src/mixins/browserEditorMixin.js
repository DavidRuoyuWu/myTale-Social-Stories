//import Axios from 'axios'
import tweeConverter from "../mixins/tweeConverterMixin"

export default{
  methods:{
    browserView(item){
      var linkBlob = new Blob([this.html(item.text)] , {type:"text/html"})
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(linkBlob);
      link.target = "_blank";
      link.click();
      URL.revokeObjectURL(link.href)
    },

    editorView(item){
      sessionStorage.setItem("createTemplate", "");
      sessionStorage.setItem("OGstoryPassages", "");
      sessionStorage.setItem("storyLocation", "");
      sessionStorage.setItem("storyContent", item.text);

      const link = document.createElement('a');
      link.href = "editor.html";
      link.click();
      URL.revokeObjectURL(link.href);

    },

    async updateViewsBrowser(item) {
      await this.updateViews(item.id, item.title, item.author, item.synopsis, item.tags, item.views, item.dateNow, item.dateAdded, item.text, item.creator, item.storyKey);
      this.browserView(item);
    },

    async updateViewsEditor(item) {
      await this.updateViews(item.id, item.title, item.author, item.synopsis, item.tags, item.views, item.dateNow, item.dateAdded, item.text, item.creator, item.storyKey);
      this.editorView(item);
    },
  },
  mixins: [tweeConverter],
}