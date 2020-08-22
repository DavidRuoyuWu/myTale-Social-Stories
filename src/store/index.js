// store/index.js

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		storyLocation: "/stories/Story Template.twee",
    storyContent: String,
    storyToPublish: '',
    hello: "Hello",
	},
	getters: {},
	mutations: {
		updateDirectory(state, payload){
			state.storyLocation = payload.searchLocation;
		},

		updateContent(state, payload){
			state.storyContent = payload.content;
    },
    
    updateStoryPublish(state, payload){
      state.storyToPublish = payload
    },

    updateHello(state, payload){
      state.hello = payload
    }
	},
	actions: {}
});