<template>
<div>
  <!--<h1 style="text-align:center">I'm a...</h1>-->
    <v-card flat class="justify-center grey lighten-5">
      <v-card-actions class="justify-center">
        <v-btn class="button" v-on:click="setUser('parent'), clicked1=true, clicked2=clicked3=clicked4=false" 
            v-bind:class="{'orange white--text': clicked1}">Parent</v-btn> 
        <v-btn class="button" v-on:click="setUser('teacher'),clicked2=true, clicked1=clicked3=clicked4=false" 
            v-bind:class="{'orange white--text': clicked2}">Teacher</v-btn>
        <v-btn class="button" v-on:click="setUser('therapist'),clicked3=true, clicked1=clicked2=clicked4=false" 
            v-bind:class="{'orange white--text': clicked3}">Therapist</v-btn>
        <v-btn class="button" v-on:click="setUser(''),clicked4=true, clicked1=clicked2=clicked3=false" 
            v-bind:class="{'orange white--text': clicked4}">General User</v-btn>
      </v-card-actions>
    </v-card>
    <br>
  <ais-instant-search :search-client="searchClient" index-name="stories">
    <div class="left-panel">
      <ais-clear-refinements />
      <h2>Tags</h2>
      <ais-refinement-list attribute="tags" :sort-by="['name:asc']" searchable show-more :show-more-limit="20" 
      :transformItems="transformTags"/>
    </div>

    <div class="right-panel">
      <ais-search-box/>
      <br>
        <ais-sort-by :items="[
          {value:'stories/', label:'Popularity'},
          {value:'stories/sort/dateNow:desc', label:'Newest'}
          ]"
        >
        </ais-sort-by>
      <ais-hits :transformItems="transformItems">
        <div slot-scope="{ items }">
          <v-card v-for="(item, i) in items" :key="i" class="single-story brown lighten-5">
            <v-card-title id="hits-title">
              <div>
                <router-link :to="{name: 'Story', params: {title:removeTitleSpaces(item.title), id: item.id}}" class="story-links"><span class="story-title">{{item.title}}</span></router-link>
                <span class="story-author font-weight-light">  by {{item.author}} </span>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-btn fab small class="mr-2 elevation-3" title="View in Browser" v-on:click="updateViewsBrowser(item)">
                  <v-icon color="orange darken-2">mdi-eye</v-icon>
                </v-btn> 
                <v-btn fab small class="mr-2 ml-1 elevation-3" title="Edit Story" v-on:click="updateViewsEditor(item)">
                  <v-icon color="orange darken-2">mdi-file-document-edit</v-icon>
                </v-btn>
              </div>
            </v-card-title>

            <v-card-actions id="hits-actions">
            
              <v-chip class="ml-2" label color="orange" text-color="white" v-for="(storyTag, i) in item.tags" :key="i">{{item.tags[i]}}</v-chip>

              <v-spacer></v-spacer>
              
              <span class="viewsDaysRating font-weight-light">
                {{item.views}} views | {{item.dateAdded}}
              </span> 
            </v-card-actions>
          </v-card>
        </div>
      </ais-hits>
      <br>
      <ais-pagination />
    </div>
  </ais-instant-search>
  <div class="py-2"></div>
</div>
</template>

<script>

import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import 'instantsearch.css/themes/algolia-min.css';
import storyMixin from "@/mixins/storyMixin"
import browserEditorMixin from "@/mixins/browserEditorMixin"
import stateManager from "@/mixins/StateManager"
import userMixin from "@/mixins/userMixin"

 
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    // Be sure to use the search-only-api-key
    //apiKey: "I2XPQEFHZRa74Bgv1tpAswfJr8jxnhJ9", 
    apiKey: "YOYCpFLj9u412ihigstCer5Zs2StzptR", 
    nodes: [
      {
        //host: "localhost",
        host: "vcm-15431.vm.duke.edu",
        port: "8108",
        protocol: "https"
      }
    ]
  },
  additionalSearchParameters: {
    queryBy: "title,author,tags",
  }
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

export default {
  data() {
    return {
      searchClient,
      clicked1: sessionStorage.getItem("user") === 'parent',
      clicked2: sessionStorage.getItem("user") === 'teacher',
      clicked3: sessionStorage.getItem("user") === 'therapist',
      clicked4: sessionStorage.getItem("user") === '' || sessionStorage.getItem("user") === null,
      storyComments:[],
    };
  },
  methods: {
    toggleTags(){
      this.tagsOn = !this.tagsOn;
    },
  },
  mixins: [storyMixin, stateManager, browserEditorMixin, userMixin], 
};
</script>

<style scoped>
.single-story {
  padding: 8px 8px 15px 8px;
  margin-top: 20px;
  margin-left: 5px;
  margin-right: 5px;
  box-sizing: border-box;
  font-style: normal;
}

.story-title {
  font-family: Playfair Display;
  letter-spacing: 0.5px;
  font-size: 24px;
}

.story-links {
  text-decoration: none;
  color: black;
}

.story-links:hover {
  text-decoration: underline;
}

.story-author {
  font-size: 17px;
}

.viewsDaysRating {
  font-size: 17px;
}

.ais-Hits-list {
  margin-top: 0;
  margin-bottom: 1em;
}

.ais-InstantSearch {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 2em;
}

.left-panel {
  margin-left: 80px;
}

.right-panel {
  margin-right: 80px;
}

#hits-title {
  padding-bottom: 12px !important;
}

#hits-actions {
  padding-top: 0px !important;
}

.comments-tags {
  margin-left: 15px;
}
.button {
  border: none;
  padding: 4px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 0px 2px 4px 2px;
  margin-right: 12px;
  cursor: pointer;
  border-radius: 12px;
  width: 15%;
}

</style>
