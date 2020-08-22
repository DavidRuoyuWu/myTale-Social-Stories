<template>
  <div id="edit_field">

    <button v-on:click="switchEdit" style="cursor: pointer;">
      <div v-if="!this.editing" id="not_editing">
        <v-card-text id="text_display"><span v-html="this.textValue"></span></v-card-text>
      </div>
    </button>

    <div v-if="this.editing" id="is_editing">
        
      <text-tiptap
        v-bind:text="this.editLinkTextValue"
        id="text_edit"
        v-on:evtPassageChange="updatePassage"
        v-bind:key="this.renderKey"
        v-bind:class="this.theme"
      />

    </div>

    <div id = "edit_options" v-if = "this.editOptions" style = "display:flex; flex-direction:row; justify-content: space-around; border-top: solid 2px lightgray; padding: 5px;">
      <v-btn id = "confirm_edit" style = "width: 20%;" v-on:click = "switchEdit">Edit</v-btn>
      <v-btn id = "cancel_edit" style = "width: 20%;" v-on:click = "showEditOptions">Cancel</v-btn>
    
    </div>

  </div>
</template>

<script>
import Text_Tiptap from "./Text_Tiptap.vue";

export default {
  name: "text-editor",

  components: {
    "text-tiptap": Text_Tiptap
  },

  props: {
    dispText: String,
    linkText: String,
    theme: String
  },

  data() {
    return {
      editing: false,
      editOptions: false,
      textValue: this.dispText,
      linkTextValue: this.linkText,

      renderKey: 0
    };
  },

  computed: {
    editLinkTextValue: function() {
      var source = this.linkTextValue;
      source = source.replace(/\n/g, "<br>");

      source = source.replace(/&quot;/g, '"');
      source = source.replace(/&#39;/g, "'");
      source = source.replace(/&lt;/g, "<");
      source = source.replace(/&gt;/g, ">");
      return "<p>" + source + "</p>";
    },

    emitLinkTextValue: function() {
      var source = this.linkTextValue;

      source = source.replace(/<p>/g, "");
      source = source.replace(/<\/p>/g, "\n");

      source = source.replace(/"/g, "&quot;");
      source = source.replace(/'/g, "&#39;");
      source = source.replace(/</g, "&lt;");
      source = source.replace(/>/g, "&gt;");

      return source.trim();
    }
  },

  methods: {
    updatePassage(event) {
      this.linkTextValue = event.replace(/<br>/g, "\n");

      // console.log(this.emitLinkTextValue);

      this.$emit("evtPassageChange", this.emitLinkTextValue);
      this.renderKey--;
    },

    switchEdit: function() {
      this.editing = !this.editing;
      this.editOptions = false;
      this.renderKey++;
    },

    showEditOptions: function(){
      this.editOptions = !this.editOptions;
    }
  }
};
</script>

<style scoped>
@keyframes border_anim {
  from {
    border: solid gray;
  }
  to {
    border: solid black;
  }
}

#edit_field {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

#not_editing {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;
  padding: 20px;
}
#text_display {
  white-space: pre-wrap;
}

#is_editing {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-around;

  padding: 10px;
}

#cancel_button {
  width: 15%;
}

#text_edit {
  box-sizing: content-box;
}

.editor_button {
  align-content: left;
  border: solid white;
  border-width: 5px;
  border-radius: 5px;
}

.editor_button:hover {
  border-width: 5px;
  border-radius: 5px;
  animation: border_anim;
  animation-fill-mode: forwards;
  animation-duration: 500ms;
}

.divider {
  grid-area: divider;
  width: auto;
  height: 20px;
  display: inline-block;
}

button{
  outline:none;
}
</style>
