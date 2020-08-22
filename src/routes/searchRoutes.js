import Search from "../components/search/Search.vue"
import storyPage from "../components/stories/storyPage.vue"
import viewStory from "../components/stories/viewStory.vue"

export default [
  {path: '/', name:'searchSort', component: Search},
  {path: '/story/:title/:id', name:'Story', component: storyPage, params:true},
  {path: '/view/:id/:storyHTML', name:'viewStory', component: viewStory, params:true}
]
