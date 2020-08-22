<template>
  <div class="editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive, focused }">
      <div
        class="menubar"
        :class="{ 'is-active': focused }"
      >

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <v-icon class="icon">mdi-format-bold</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <v-icon>mdi-format-italic</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <v-icon>mdi-format-strikethrough-variant</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <v-icon>mdi-format-underline</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          <v-icon>mdi-format-header-1</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          <v-icon>mdi-format-header-2</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          <v-icon>mdi-format-header-3</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </button>

        <div class="divider" />

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <v-icon>mdi-format-list-numbers</v-icon>
        </button>
      </div>
    </editor-menu-bar>

    <editor-content id = "editorStyle" class="editor_content" :editor="editor" />

    <div class="spacing" />

    <v-btn id="done_button" v-on:click = "emitEdit(); switchEdit();">{{ this.saveStatus == "Saved!" ? "Done" : "Saving..."}}</v-btn>
  </div>
</template>

<script>
import Editor from "@/js/tiptap/packages/tiptap/src/Editor.js";
import EditorContent from "@/js/tiptap/packages/tiptap/src/Components/EditorContent.js";
import EditorMenuBar from "@/js/tiptap/packages/tiptap/src/Components/EditorMenuBar.js";
// import EditorMenuBubble from '@/js/tiptap/packages/tiptap/src/Components/EditorMenuBubble.js'

import Blockquote from "@/js/tiptap/packages/tiptap-extensions/src/nodes/Blockquote.js";
import BulletList from "@/js/tiptap/packages/tiptap-extensions/src/nodes/BulletList.js";
import HardBreak from "@/js/tiptap/packages/tiptap-extensions/src/nodes/HardBreak.js";
import Heading from "@/js/tiptap/packages/tiptap-extensions/src/nodes/Heading.js";
import ListItem from "@/js/tiptap/packages/tiptap-extensions/src/nodes/ListItem.js";
import OrderedList from "@/js/tiptap/packages/tiptap-extensions/src/nodes/OrderedList.js";
import Bold from "@/js/tiptap/packages/tiptap-extensions/src/marks/Bold.js";
import Italic from "@/js/tiptap/packages/tiptap-extensions/src/marks/Italic.js";
import Strike from "@/js/tiptap/packages/tiptap-extensions/src/marks/Strike.js";
import Underline from "@/js/tiptap/packages/tiptap-extensions/src/marks/Underline.js";
import FontTextColor from "@/js/tiptap/packages/tiptap-extensions/src/marks/FontTextColor.js";

import debounce from 'debounce'

export default {
  name: "text-tiptap",

  components: {
    EditorContent,
    EditorMenuBar
    // EditorMenuBubble,
  },

  props: {
    text: String
  },

  data() {
    return {
      passageText: this.text,
      saveStatus: "Saved!",
      isTyping: false,

      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new ListItem(),
          new OrderedList(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new FontTextColor()
        ],
        content: this.text
      })
    };
  },
  beforeDestroy() {
    this.emitEdit();

    this.editor.destroy();
  },

  computed: {
    editing: function() {
      return this.editor.focused;
    },

    html: function() {
      return this.editor.getHTML();
    }
  },

  watch: {
    editing: function() {
      if (this.editing) {
        this.saveStatus = "Saving...";
        this.isTyping = true;
      }
      if (!this.editing) {
        this.saveStatus = "Saving...";
        setTimeout(() => {
          this.isTyping = false;
          this.saveStatus = "Saved!";
        }, 500);
      }
      if (!this.editing && !this.isTyping) {
        this.saveStatus = "Saved!";
        this.isTyping = false;
        this.stashEdit();
      }
    },

    html: debounce(function(){
      this.isTyping = false;
      this.stashEdit();
      this.saveStatus = "Saved!"
    }, 500)

  },

  methods: {
    emitEdit: function() {
      this.passageText = this.editor.getHTML();
      // console.log("Saving...");
      this.$emit("evtPassageChange", this.passageText);
      this.saveStatus = "Saved!";
    },

    stashEdit: function(){
      this.passageText = this.editor.getHTML();
    },

    switchEdit: function() {
      this.$emit("switchEdit", false);
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

#editorStyle{
  border:solid lightgray;
  border-top: solid white;
  border-width: 2px;
  background: 	white;
  outline:none;
  padding: 10px;
}

.menubar {
  border:solid lightgrey;
  border-width: 2px;
  background: whitesmoke;
}

.menubar__button {
  background-color: transparent;
  color: black;
  padding: 2px 2px;
  font-size: 20px;
  height: 50%;
  border: lightgrey;
}

.spacing {
  width: 100%;
  height: 15px;
}

.divider {
  width: 10px;
  height: auto;
  display: inline-block;
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
</style>
