import userProfile from "../components/users/userProfile.vue"
import storyPage from "../components/stories/storyPage.vue"

export default [
  {path: '/', name:'userProfile', component: userProfile},
  {path: '/story/:title/:id', name:'Story', component: storyPage, params:true},
]