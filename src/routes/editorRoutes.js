import Editor from "@/components/editor/Editor.vue"
import addStory from "@/components/stories/addStory.vue"

export default [
  {path: '/', name:'editor', component: Editor},
  {path: '/addStory', name:'addStory', component: addStory},
]
