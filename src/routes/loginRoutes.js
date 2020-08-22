import login from "../components/users/login.vue"
import resetPassword from "../components/users/resetPassword.vue"

export default [
  {path: '/', name:'login', component: login},
  {path: '/ResetPassword', name:'resetPassword', component: resetPassword},
]
