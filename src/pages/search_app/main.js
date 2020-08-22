import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify';
import InstantSearch from 'vue-instantsearch';
import store from '../../store';
import "../../firebaseConfig"
import titleMixin from '@/mixins/titleMixin';
import VueResource from 'vue-resource'
import {rtdbPlugin} from 'vuefire'
import firebase from 'firebase'
import VueRouter from 'vue-router'
import Routes from '../../routes/searchRoutes'

Vue.mixin(titleMixin);
Vue.use(InstantSearch);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(rtdbPlugin);

const router = new VueRouter({
  routes: Routes
})


Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(function(){
  if(!app) {
    app = new Vue({
      vuetify,
      store,
      router: router,
      render: h => h(App)
    }).$mount('#app')
  }
})