import Vue from 'vue';
import App from './App.vue';
import vuetify from '@/plugins/vuetify';
import store from '../../store';
import titleMixin from '@/mixins/titleMixin';
import "../../firebaseConfig";
import firebase from 'firebase'

Vue.mixin(titleMixin)
Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(function(){
  if(!app) {
    app = new Vue({
      vuetify,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})