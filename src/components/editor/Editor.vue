<template>
    <div class = "editor">
        <v-card fluid outlined class="column" id="toolBar" :width="this.toolsWidth" :height="this.contentHeight">
        <gso v-bind:key = "this.renderHints.gsoRenderKey" v-bind:isLoggedIn = "this.isLoggedIn" v-bind:storyName = "this.storyName" v-bind:minimized = "this.hideItem"
                                            v-on:evtDownloadStory = "downloadStory"
                                            v-on:evtViewHTML = "viewStoryHTML"
                                            v-on:evtNewStoryName = "changeStoryName"
                                            v-on:evtSave = "saveStoryToProfile"
                                            v-on:evtPublish = "getExportFile"
                                            v-on:evtNewStory = "loadTwee"
                                            v-on:evtCreateNewStory = "loadStoryTemplate"/>

        <v-toolbar
          color="orange darken-2"
          flat
          dark
        > 
            <v-toolbar-title><h4>TOOLS</h4></v-toolbar-title>
            <v-spacer/>
             <v-btn fab light x-small @click="hideTools">
                <v-icon>{{toolButton}}</v-icon>
            </v-btn>
        </v-toolbar>

        <v-tabs vertical color="orange darken-2">
            <v-tab v-on:click = "renderHints.inVariableEditor = true; renderHints.inMediaEditor = false; hideThemes(); "><h5>Text</h5></v-tab>

            <v-tab v-on:click = "renderHints.inVariableEditor = false; renderHints.inMediaEditor = true; hideThemes(); "><h5>Media</h5></v-tab>

            <v-tab v-on:click = "renderHints.inVariableEditor = false; renderHints.inMediaEditor = false; showThemes(); "><h5>Themes</h5></v-tab>
            
            <v-tab v-on:click = "renderHints.inVariableEditor = false; renderHints.inMediaEditor = false; hideThemes(); "><h5>Passages</h5></v-tab>

          <v-tab-item :hidden="this.hideItem">
            <v-card flat>
              <v-card-text>
                <var-sidebar id = "var_sidebar" v-bind:key = "this.renderHints.variableRenderKey"
                                            v-bind:storyVars = "this.storyVariables" 
                                            v-on:evtVarValueChange = "setVariable"
                                            v-on:evtVarNameChange = "setVariableName"
                                            v-on:evtDelete = "deleteVariable"
                                            v-on:evtDispVars = "regenerateStoryText"
                                            v-on:evtNewVar = "addNewVariable"></var-sidebar>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item :hidden="this.hideItem">
            <v-card flat>
              <v-card-text>
                <media-sidebar id = "media_sidebar" v-bind:key = "this.renderHints.mediaRenderKey"
                                v-bind:imageVars = "this.imageVariables"
                                v-bind:audioVars = "this.audioVariables"
                                v-bind:status = "this.status"
                                v-on:evtDispVars = "regenerateStoryText"
                                v-on:evtReplaceImage = "replaceImage"
                                v-on:evtReplaceAudio= "replaceAudio"
                                v-on:evtAudioNameChange = "replaceAudioName"
                                v-on:evtImageNameChange = "replaceImageName"
                                v-on:evtNewImageVariable = "addImageVariable"
                                v-on:evtNewAudioVariable = "addAudioVariable"
                                v-on:evtAddImage = "addImageToPage"
                                v-on:evtAddAudio = "addAudioToPage"
                                v-on:evtRemoveImage = "removeImageVariable"
                                v-on:evtRemoveAudio = "removeAudioVariable"></media-sidebar>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item :hidden="this.hideItem">
            <v-card flat>
              <v-card-text>
                <themes-sidebar id = "themes_sidebar"
                            v-on:evtNewTheme = "setTheme"
                            v-on:evtNewThemeAll = "setThemeAll"
                            v-bind:backgroundColor = "this.storyPages[this.currentPage - 1].extractCSSProperty('background-color')"
                            v-bind:textColor = "this.storyPages[this.currentPage - 1].extractCSSProperty('color')"></themes-sidebar>
              </v-card-text>
            </v-card>

          </v-tab-item>
            <v-tab-item :hidden = "this.hideItem">
                <v-card flat>
                    <v-card-text>
                        <passage-sidebar id = "passage_sidebar" v-bind:storyPages = "this.storyPages" v-bind:currPassage = "this.storyPages[this.currentPage - 1].pageName" v-bind:key = "this.renderHints.passageRenderKey"
                                                                v-on:evtNewPassageName = "updatePassageName"
                                                                v-on:evtRemoveLink = "removeLink"
                                                                v-on:evtAddLink = "addLink"
                                                                v-on:evtGoToPage = "goToPage"
                                                                v-on:evtCreateNew = "addPage"
                                                                v-on:evtDelete = "deletePassage"></passage-sidebar>
                    </v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
       
        <div style = "border-top: solid 2px lightgray; padding: 10px;">
            <v-card-text>Need help using the editor? Visit <a href="MyTale Guide.html" target = "_blank">Support</a>.</v-card-text>
        </div>
    </v-card>

        <v-card outlined class="column" id="storyPage" :width="this.pageWidth" :height="this.contentHeight">
            <page-layout id = "page_layout" v-bind:key = "this.renderHints.renderKey" 
                                            v-bind:page = "this.storyPages[this.currentPage - 1]"
                                            v-bind:imageVars = "this.imageVariables"
                                            v-bind:audioVars = "this.audioVariables"   
                                            v-bind:themeView = "this.themeView" 
                                            v-on:evtNext = "nextPage"
                                            v-on:evtStart = "goToStart"
                                            v-on:evtPrev = "prevPage"
                                            v-on:evtPassageNameChange = "updatePassageName"
                                            v-on:evtPassageChange = "updatePassage"
                                            v-on:evtDelete = "deletePassage"
                                            v-on:evtMinHeight = "setMinHeight"
                                            v-on:evtStartPage = "setStartPage"
                                            v-on:removeImageFromPage = "removeImageFromPage"
                                            v-on:removeAudioFromPage = "removeAudioFromPage"></page-layout>
            
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind = "attrs" v-on = "on" top left absolute icon light @click="goFullScreen"><v-icon>{{fullButton}}</v-icon></v-btn>
                </template>
                <span>{{!inFullMode ? "Full Screen": "Exit Full Screen"}}</span>
            </v-tooltip>
        </v-card>
    </div>
</template>

<script>
import Sidebar_Variables from './tools/variables/Sidebar_Variables.vue'
import Sidebar_Media from './tools/media/Sidebar_Media.vue'
import Sidebar_Themes from './tools/themes/Sidebar_Themes.vue'
import Sidebar_Passage from './tools/passage/Sidebar_Passage.vue'
import Global_Story_Options from './tools/options/Global_Story_Options.vue'
import Page_Layout from './Page_Layout.vue'

import FileConverter from '@/js/extwee_utils/FileConverter.js'
import StoryEditor from '@/js/extwee_utils/StoryEditor.js'
import firebase from 'firebase'
import {db} from "@/firebaseConfig"
import storyMixin from '../../mixins/storyMixin'
import tweeConverter from '../../mixins/tweeConverterMixin'
import Axios from 'axios'
import FileSaver from 'browser-filesaver'
import debounce from 'debounce'

var JSZip = require('jszip');


export default {
    name: "editor",

    data(){
        return{
            isLoggedIn: false,

            /////
            userRef: null,
            storyRef: null,
            basePath: '',
            totalFileSize: 0,
            maxStorageSize: 15,
            status: '',
            /////

            storyName: '',
            storyPages: Array,
            storyVariables: Map,
            imageVariables: Map,
            audioVariables: Map,

            currentPage: 1,
            pagesVisited: [],

            toolsWidth: "30%",
            
            pageWidth: "70%",
            contentHeight: "74vh",
            minHeight: "500px",
            hideItem: false,
            toolButton: "mdi-minus",
            fullButton: "mdi-fullscreen",
            inFullMode: false,

            themeView: false,

            handles:{
                storyEditor: StoryEditor,
                fileConverter: FileConverter,
            },
            
            renderHints:{
                renderKey: 1,
                variableRenderKey: 1,
                themesRenderKey: 1,
                passageRenderKey: 1,
                gsoRenderKey: 1,
                mediaRenderKey: 1,
                hidden: true,
                inVariableEditor: true,
                inMediaEditor: false,
            },
            
            hi: "Hello",
            exportFile: ''
        }
    },

    created: function(){
        /////
        if(firebase.auth().currentUser){
            this.isLoggedIn = true;
        }
        if(this.isLoggedIn) {
            var storageRef = firebase.storage().ref();
            var userID = firebase.auth().currentUser.email;
            this.userRef = storageRef.child(userID);
        }
        /////

        if(this.$store.state.storyLocation != ""){
            Axios.get(this.$store.state.storyLocation).then(response => {
                if(response.data != null){
                    this.loadContents(response.data);
                    if (sessionStorage.getItem("OGstoryPassages") === "" || sessionStorage.getItem("OGstoryPassages") === null) {
                        sessionStorage.setItem("OGstoryPassages", JSON.stringify(this.handles.storyEditor.exportedStoryPages));
                    }
                    sessionStorage.setItem("createTemplate", "yes");
                    console.log("Read Success");
                } else {
                    console.log("Read Fail")
                }
            });
        } else if(this.$store.state.storyContent != ""){
            console.log(sessionStorage.getItem("storyContent"));
            this.loadContents(this.$store.state.storyContent);
            if (sessionStorage.getItem("OGstoryPassages") === "") {
                sessionStorage.setItem("OGstoryPassages", JSON.stringify(this.handles.storyEditor.exportedStoryPages));
            }
            //this.handles.storyEditor.removeVariableInject();
            this.regenerateStoryText({disp: true});
        }

        if(this.isLoggedIn) {
            if(this.storyName == '') {
                this.storyName = "Story Template";
            }
            this.storyRef = this.userRef.child(this.storyName);
            this.basePath = this.isLoggedIn.email + '/' + this.storyName + '/';
        }

        /////
        if(this.isLoggedIn) {
            this.storyRef.listAll().then(function(result) {
                result.items.forEach(function(mediaRef) {                    
                    var key = '@' + mediaRef.name.substring(0, mediaRef.name.indexOf("="));
                    
                    if(this.imageVariables.has(key)) {
                        var currValue = this.imageVariables.get(key);
                        var value = {file: currValue.file,
                                fileName: mediaRef.name.substring(mediaRef.name.indexOf("=")+1),
                                path: mediaRef.getDownloadURL(),
                                id: currValue.id,
                                color: currValue.color,
                                uploaded: true,};
                        this.handles.storyEditor.setImageVariable(key, value);
                        this.totalFileSize += currValue.file.size / 1024 / 1024;
                    }
                    if(this.audioVariables.has(key)) {
                        currValue = this.audioVariables.get(key);
                        value = {file: currValue.file,
                                fileName: mediaRef.name.substring(mediaRef.name.indexOf("=")+1),
                                path: mediaRef.getDownloadURL(),
                                id: currValue.id,
                                color: currValue.color,
                                uploaded: true,};
                        this.handles.storyEditor.setAudioVariable(key, value);
                        this.totalFileSize += currValue.file.size / 1024 / 1024;
                    }
                    console.log(this.imageVariables);
                    console.log(this.audioVariables);
                }.bind(this));
            }.bind(this));
        }
        /////
    },

    components:{
        'var-sidebar': Sidebar_Variables,
        'media-sidebar': Sidebar_Media,
        'themes-sidebar': Sidebar_Themes,
        'passage-sidebar': Sidebar_Passage,
        'page-layout': Page_Layout,
        'gso': Global_Story_Options
    },

    watch: {
        status: debounce(function() {
            if(this.status.includes("success")) {
                this.status = "";
                this.renderHints.renderKey++;
                this.checkRenderHints();
            }
        }, 3000)
    },

    methods:{
        loadTwee: function(files){
            console.log(files);

            const file = files[0];

            var isHTML = file.name.includes(".html");

            this.storyVariables = null;
            this.storyLinkPassages = null;
            this.storyDispPassages = null;

            this.handles.storyEditor = null;
            this.handles.fileConverter = null;

            const tempFileReader = new FileReader();

            tempFileReader.onload = () =>{
                // alert(tempFileReader.result);

                this.handles.fileConverter = new FileConverter(tempFileReader.result, isHTML);
                this.handles.storyEditor = new StoryEditor(this.handles.fileConverter.story);
                this.storyVariables = this.handles.storyEditor.variables;
                this.imageVariables = this.handles.storyEditor.imageVariables;
                this.audioVariables = this.handles.storyEditor.audioVariables;
                this.storyPages = this.handles.storyEditor.exportedStoryPages;
                this.storyName = this.handles.storyEditor.baseStory.name;
                
                this.goToStart();
                
                this.renderHints.renderKey++;
                this.renderHints.variableRenderKey++;
                this.renderHints.passageRenderKey++;
                this.renderHints.gsoRenderKey++;

                this.renderHints.hidden = true;
                this.checkRenderHints();

                sessionStorage.setItem("storyContent", tempFileReader.result);
                sessionStorage.setItem("storyLocation", "");

                this.regenerateStoryText({disp: this.renderHints.hidden});

            }
            tempFileReader.readAsText(file);
        },

        loadContents: function(contents){
            this.storyVariables = null;
            this.storyLinkPassages = null;
            this.storyDispPassages = null;

            this.handles.storyEditor = null;
            this.handles.fileConverter = null;

            this.handles.fileConverter = new FileConverter(contents, false);
            this.handles.storyEditor = new StoryEditor(this.handles.fileConverter.story);
            this.storyVariables = this.handles.storyEditor.variables;
            this.imageVariables = this.handles.storyEditor.imageVariables;
            this.audioVariables = this.handles.storyEditor.audioVariables;
            this.storyPages = this.handles.storyEditor.exportedStoryPages;
            this.storyName = this.handles.storyEditor.baseStory.name;
        
            this.goToStart();

            this.renderHints.renderKey++;
            this.renderHints.variableRenderKey++;
            this.renderHints.passageRenderKey++;
            this.renderHints.gsoRenderKey++;

            this.renderHints.hidden = true;
            this.checkRenderHints();

            this.regenerateStoryText({disp: this.renderHints.hidden});
        },

        loadStoryTemplate: function(){

            console.log("story template");

            Axios.get("/stories/Story Template.twee").then(response => {
                if(response.data != null){
                    this.loadContents(response.data);
                    sessionStorage.setItem("OGstoryPassages", JSON.stringify(this.handles.storyEditor.exportedStoryPages));
                    sessionStorage.setItem("createTemplate", "yes");
                    console.log("Read Success");
                } else {
                    console.log("Read Fail")
                }
            });
                
            this.regenerateStoryText({disp: this.renderHints.hidden});
        },

        replaceImage: function(event){
            this.handles.storyEditor.setImageVariable(event.name, event.data);

            this.writeToStorage();
            
            this.renderHints.renderKey++;
            this.renderHints.mediaRenderKey++;
            this.checkRenderHints();
            
            /////
            var imgData = this.imageVariables.get(event.name);
            if(this.isLoggedIn) {
                var removeRef = this.storyRef.child(event.name.replace("@", "") + "=" + event.oldData.fileName);
                removeRef.delete().then(function() {
                    this.status = "Uploading " + event.data.fileName + "... please be patient :)";
                });
                this.totalFileSize -= event.oldData.file.size / 1024 / 1024;
                this.totalFileSize += event.data.file.size / 1024 / 1024;

                if(this.totalFileSize > this.maxStorageSize) {
                    this.totalFileSize -= event.data.file.size / 1024 / 1024;
                    this.totalFileSize += event.oldData.file.size / 1024 / 1024;
                    this.status = "Sorry! It looks like you've run out of storage space. Try uploading a smaller file!";
                    
                    this.handles.storyEditor.setImageVariable(event.name, event.oldData);
                    this.renderHints.renderKey++;
                    this.renderHints.mediaRenderKey++;
                    this.checkRenderHints();
                } else {
                    var newRef = this.storyRef.child(event.name.replace("@", "") + "=" + event.data.fileName);
                    newRef.put(event.data.file).then(function() {
                        this.status = "Upload for " + event.data.fileName + " successful!";
                        var obj = { file: event.data.file,
                                    fileName: event.data.fileName,
                                    path: newRef.getDownloadURL(),
                                    color: imgData.color,
                                    id: imgData.id,
                                    uploaded: true,};
                        this.handles.storyEditor.setImageVariable(event.name, obj);
                    
                        this.renderHints.renderKey++;
                        this.renderHints.mediaRenderKey++;
                        this.checkRenderHints();

                        console.log(this.imageVariables);
                    }.bind(this));
                }
            }
            /////
        },

        replaceAudio: function(event){
            this.handles.storyEditor.setAudioVariable(event.name, event.data);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.mediaRenderKey++;
            this.checkRenderHints();

            /////
            var audData = this.audioVariables.get(event.name);
            if(this.isLoggedIn) {
                var removeRef = this.storyRef.child(event.name.replace("@", "") + "=" + event.oldData.fileName);
                removeRef.delete().then(function() {
                    this.status = "Uploading " + event.data.fileName + "... please be patient :)";
                });
                this.totalFileSize -= event.oldData.file.size / 1024 / 1024;
                this.totalFileSize += event.data.file.size / 1024 / 1024;

                if(this.totalFileSize > this.maxStorageSize) {
                    this.totalFileSize -= event.data.file.size / 1024 / 1024;
                    this.totalFileSize += event.oldData.file.size / 1024 / 1024;
                    this.status = "Sorry! It looks like you've run out of storage space. Try uploading a smaller file!";
                    
                    this.handles.storyEditor.setAudioVariable(event.name, event.oldData);
                    this.renderHints.renderKey++;
                    this.renderHints.mediaRenderKey++;
                    this.checkRenderHints();
                } else {
                    var newRef = this.storyRef.child(event.name.replace("@", "") + "=" + event.data.fileName);
                    newRef.put(event.data.file).then(function() {
                        this.status = "Upload for " + event.data.fileName + " successful... thanks for waiting!";
                        var obj = { file: event.data.file,
                                    fileName: event.data.fileName,
                                    path: newRef.getDownloadURL(),
                                    color: audData.color,
                                    id: audData.id,
                                    uploaded: true,};
                        this.handles.storyEditor.setAudioVariable(event.name, obj);

                        this.renderHints.renderKey++;
                        this.renderHints.mediaRenderKey++;
                        this.checkRenderHints();

                        console.log(this.audioVariables);
                    }.bind(this));
                }
            }
            /////
        },

        replaceImageName: function(event){
            var process = this.handles.storyEditor.changeImageVariableName(event);

            this.writeToStorage();

            this.renderHints.renderKey++; 
            this.renderHints.mediaRenderKey++;
            this.checkRenderHints();

            /////
            var fileName = event.fileName;
            if(this.isLoggedIn && process) {
                var removeRef = this.storyRef.child(event.prevName.replace("@", "") + "=" + fileName);
                removeRef.delete();
                var imgData = this.imageVariables.get(event.newName);
                var newRef = this.storyRef.child(event.newName.replace("@", "") + "=" + fileName);
                newRef.put(imgData.file).then(function() {
                    this.status = "Your changes were saved successfully!";

                    if(imgData.path.i.includes("blob")){
                        URL.revokeObjectURL(imgData.path.i);
                    }

                    var obj = { file: imgData.file,
                                fileName: fileName,
                                path: newRef.getDownloadURL(),
                                color: imgData.color,
                                id: imgData.id,
                                uploaded: true};
                    this.handles.storyEditor.setImageVariable(event.newName, obj);

                    this.renderHints.renderKey++;
                    this.renderHints.mediaRenderKey++;
                    this.checkRenderHints();
                    
                    //console.log(this.imageVariables);
                }.bind(this));
            }
            /////
        },

        replaceAudioName: function(event){
            var process = this.handles.storyEditor.changeAudioVariableName(event);

            this.writeToStorage();

            this.renderHints.renderKey++; 
            this.renderHints.mediaRenderKey++;
            this.checkRenderHints();

            /////
            var fileName = event.fileName;
            if(this.isLoggedIn && process) {
                var removeRef = this.storyRef.child(event.prevName.replace("@", "") + "=" + fileName);
                removeRef.delete();
                var audData = this.audioVariables.get(event.newName);
                var newRef = this.storyRef.child(event.newName.replace("@", "") + "=" + fileName);
                newRef.put(audData.file).then(function() {
                    this.status = "Your changes were saved successfully!";

                    if(audData.path.i.includes("blob")){
                        URL.revokeObjectURL(audData.path.i);
                    }

                    var obj = { file: audData.file,
                                fileName: fileName,
                                path: newRef.getDownloadURL(),
                                color: audData.color,
                                id: audData.id,
                                uploaded: true};
                    this.handles.storyEditor.setAudioVariable(event.newName, obj);

                    this.renderHints.renderKey++;
                    this.renderHints.mediaRenderKey++;
                    this.checkRenderHints();
                    
                    console.log(this.audioVariables);
                }.bind(this));
            }
            /////
        },

        addImageVariable: function(event){
            for(var i = 0; i < event.length; i++){
                this.handles.storyEditor.addImageVariable(event[i]);
            }
            this.handles.storyEditor.reparseMedia();

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.mediaRenderKey++;
            this.checkRenderHints();

            /////
            if(this.isLoggedIn) {
                this.imageVariables.forEach(function(value, key) {
                    this.status = "Uploading " + value.fileName + "... please be patient :)";
                    console.log("Uploaded:" + value.uploaded);

                    if(value.uploaded == false) {
                        var currImageRef = this.storyRef.child(key.replace("@", "") + "=" + value.fileName);
                        var file = value.file;
                        this.totalFileSize += file.size / 1024 / 1024;
                        if(this.totalFileSize > this.maxStorageSize) {
                            this.totalFileSize -= file.size / 1024 / 1024;
                            this.status = "Sorry! It looks like you've run out of storage space. Try uploading smaller files!";
                            //this.handles.storyEditor.deleteImageVariable(key);
                            this.removeImageVariable({name: key, fileName: value.fileName, file: value.file})
                        } else {
                            currImageRef.put(file).then(function() {
                                this.status = "Upload for " + value.fileName + " successful... thanks for waiting!";

                                if(value.path.i.includes("blob")){
                                    URL.revokeObjectURL(value.path.i);
                                }

                                var obj = { file: value.file,
                                            fileName: value.fileName,
                                            path: currImageRef.getDownloadURL(),
                                            color: value.color,
                                            id: value.id,
                                            uploaded: true};
                                this.handles.storyEditor.setImageVariable(key, obj);
                                //console.log(this.imageVariables);
                                //console.log(this.totalFileSize);

                                this.renderHints.renderKey++;
                                this.renderHints.mediaRenderKey++;
                                this.checkRenderHints();
                            }.bind(this));
                        }
                    }
                }.bind(this));
            }
            /////
        },

        addAudioVariable: function(event){
            for(var i = 0; i < event.length; i++){
                this.handles.storyEditor.addAudioVariable(event[i]);
            }
            this.handles.storyEditor.reparseMedia();

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.mediaRenderKey++; 
            this.checkRenderHints();

            /////
            if(this.isLoggedIn) {
                this.audioVariables.forEach(function(value, key) {
                    this.status = "Uploading " + value.fileName + "... please be patient :)";
                    console.log("Uploaded:" + value.uploaded);

                    if(value.uploaded == false) {
                        var currAudRef = this.storyRef.child(key.replace("@", "") + "=" + value.fileName);
                        var file = value.file;
                        this.totalFileSize += file.size / 1024 / 1024;
                        if(this.totalFileSize > this.maxStorageSize) {
                            this.totalFileSize -= file.size / 1024 / 1024;
                            this.status = "Sorry! It looks like you've run out of storage space. Try uploading smaller files!";
                            //this.handles.storyEditor.deleteAudioVariable(key);
                            this.removeAudioVariable({name: key, fileName: value.fileName, file: value.file})
                        } else {
                            currAudRef.put(file).then(function() {
                                this.status = "Upload for " + value.fileName + " successful... thanks for waiting!";

                                if(value.path.i.includes("blob")){
                                    URL.revokeObjectURL(value.path.i);
                                }
                                
                                var obj = { file: value.file,
                                            fileName: value.fileName,
                                            path: currAudRef.getDownloadURL(),
                                            color: value.color,
                                            id: value.id,
                                            uploaded: true};
                                this.handles.storyEditor.setAudioVariable(key, obj);
                                console.log(this.audioVariables);
                                console.log(this.totalFileSize);

                                this.renderHints.renderKey++;
                                this.renderHints.mediaRenderKey++;
                                this.checkRenderHints();
                            }.bind(this));
                        }
                    }
                }.bind(this));
            }
            /////
        },

        removeImageVariable: function(event){
            this.handles.storyEditor.deleteImageVariable(event);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.mediaRenderKey++; 
            this.checkRenderHints();

            /////
            if(this.isLoggedIn) {
                var removeRef = this.storyRef.child(event.name.replace("@", "") + "=" + event.fileName);
                removeRef.delete().then(function() {
                    console.log("DELETED");
                });
                this.writeToStorage();
                this.totalFileSize -= event.file.size / 1024 / 1024;
            }
            /////
        },

        removeAudioVariable: function(event){
            this.handles.storyEditor.deleteAudioVariable(event);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.mediaRenderKey++;
            this.checkRenderHints();

            /////
            if(this.isLoggedIn) {
                var removeRef = this.storyRef.child(event.name.replace("@", "") + "=" + event.fileName);
                removeRef.delete().then(function() {
                    console.log("DELETED");
                });
                this.writeToStorage();
                this.totalFileSize -= event.file.size / 1024 / 1024;
            }
            /////
        },

        addImageToPage(event){
            var data = {name: event.name, pageName: this.storyPages[this.currentPage - 1].pageName};
            this.handles.storyEditor.addImageToPage(data);

            this.writeToStorage();

            this.renderHints.renderKey++; 
            this.checkRenderHints();
        },

        addAudioToPage(event){
            var data = {name: event.name, pageName: this.storyPages[this.currentPage - 1].pageName};
            this.handles.storyEditor.addAudioToPage(data);

            this.writeToStorage();

            this.renderHints.renderKey++; 
            this.checkRenderHints();
        },

        removeImageFromPage(event){
            var data = {name: event.name, pageName: this.storyPages[this.currentPage - 1].pageName};
            this.handles.storyEditor.removeImageFromPage(data);

            this.writeToStorage();

            this.renderHints.renderKey++; 
            this.checkRenderHints();
        },

        removeAudioFromPage(event){
            var data = {name: event.name, pageName: this.storyPages[this.currentPage - 1].pageName};
            this.handles.storyEditor.removeAudioFromPage(data);

            this.writeToStorage();
            
            this.renderHints.renderKey++; 
            this.checkRenderHints();
        },

        nextPage: function(event){
            this.pagesVisited.push(this.currentPage);

            if(event.location < this.storyPages.length){
                this.currentPage = event.location + 1;
            }
            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        goToStart: function(){
            this.pagesVisited = [];

            for(var i = 0; this.storyPages.length; i++){
                if(this.storyPages[i].linkPassage.tags.includes("start")){
                    this.currentPage = i + 1;
                    break;
                }
            }

            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        setStartPage: function(event){
            this.handles.storyEditor.setStartPage(event);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        prevPage: function(){
            if(this.pagesVisited.length > 0){
                this.currentPage = this.pagesVisited[this.pagesVisited.length - 1];
                this.pagesVisited.pop();
            } else {
                return false;
            }
            
            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();

            return true;
        },

        addPage: function(event){
            this.storyPages[this.currentPage - 1].linkPassage.text += "\n[[" + event.name + "]]";
            var variablesPassage = this.storyPages[this.currentPage - 1].linkPassage.tags.includes("variables");
            this.updatePassage({name: this.storyPages[this.currentPage - 1].linkPassage.name, text: this.storyPages[this.currentPage - 1].linkPassage.text, isVariables: variablesPassage});
            
            this.handles.storyEditor.addPage({name: event.name, prevLink: this.storyPages[this.currentPage - 1].linkPassage.name});

            this.writeToStorage();

            this.goToPage(event);
        },

        goToPage: function(event){
            for(var i = 0; this.storyPages.length; i++){
                if(this.storyPages[i].linkPassage.name == event.name){
                    this.currentPage = i + 1;
                    break;
                }
            }

            this.renderHints.renderKey++;
            this.checkRenderHints();
        },

        showThemes: function(){
            this.themeView = true;

            this.regenerateStoryText({disp: this.renderHints.hidden});

            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        hideThemes: function(){
            this.themeView = false;
            
            this.regenerateStoryText({disp: this.renderHints.hidden});

            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        setTheme: function(event) {
            this.storyPages[this.currentPage - 1].theme = "color:" + event.textColor + ";background-color:" + event.bgColor;
            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        setThemeAll: function(event){
            for(var i = 0; i < this.storyPages.length; i++){
                this.storyPages[i].theme = "color:" + event.textColor + ";background-color:" + event.bgColor;
            }

            this.renderHints.renderKey++;
            this.renderHints.themesRenderKey++;
            this.checkRenderHints();
        },

        setVariable: function(event){
            this.handles.storyEditor.setTextVariable(event.name, event.value);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.checkRenderHints();
        },

        setVariableName: function(event){
            this.handles.storyEditor.changeTextVariableName(event);
            
            this.writeToStorage();
            this.renderHints.variableRenderKey++;
            this.renderHints.renderKey++;
            this.checkRenderHints();
        },

        deleteVariable: function(event){
            this.handles.storyEditor.deleteTextVariable(event);

            this.writeToStorage();
            this.renderHints.variableRenderKey++;
            this.renderHints.renderKey++;
            this.checkRenderHints();
        },

        regenerateStoryText: function(event){
            this.renderHints.hidden = event.disp;

            this.handles.storyEditor.generateStoryText(this.renderHints.hidden, this.renderHints.inVariableEditor, this.renderHints.inMediaEditor);
            this.storyVariables = this.handles.storyEditor.variables;
            this.imageVariables = this.handles.storyEditor.imageVariables;
            this.audioVariables = this.handles.storyEditor.audioVariables;
            this.storyPages = this.handles.storyEditor.exportedStoryPages;
            this.storyName = this.handles.storyEditor.baseStory.name;
            
            this.renderHints.renderKey++; 
            this.checkRenderHints();       
        },

        addNewVariable: function(event) {
            this.handles.storyEditor.addTextVariable(event);
            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.variableRenderKey++;
            this.checkRenderHints();
        },

        addLink: function(event){
            this.handles.storyEditor.addLink({pageName: this.storyPages[this.currentPage - 1].pageName, name: event.name});
            
            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.passageRenderKey++;
            this.checkRenderHints();
        },

        removeLink: function(event){
            this.handles.storyEditor.removeLink(event);
            
            this.writeToStorage();

            this.renderHints.renderKey++;
            this.checkRenderHints();
        },

        updatePassage: function(event){
            this.handles.storyEditor.setPassage(event.name, event.text);
            
            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.passageRenderKey++;

            if(event.isVariables){
                this.renderHints.variableRenderKey++;
            }

            this.checkRenderHints();
        },

        updatePassageName: function(event) {
            this.handles.storyEditor.changePassageName(event);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.renderHints.passageRenderKey++;
            this.checkRenderHints();
        },

        deletePassage: function(event){
            this.handles.storyEditor.deletePassage(event);
            
            this.writeToStorage();

            this.renderHints.passageRenderKey++;

            if(!this.prevPage()){
                this.goToStart();
            }
        },

        changeStoryName(event){
            this.handles.storyEditor.changeStoryName(event);

            this.writeToStorage();

            this.renderHints.renderKey++;
            this.checkRenderHints();
        },

        downloadStoryTwee: function(){
            var storyView = this.handles.storyEditor.generateSaveStory();
            this.handles.fileConverter.story = storyView;

            var tweeBlob = this.handles.fileConverter.twee();

            var dlblob = new Blob([tweeBlob], {type: "text/plain"});

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dlblob);
            link.target = "_blank"
            link.setAttribute('download',  this.handles.storyEditor.baseStory.name + '.twee');
            link.click();
            URL.revokeObjectURL(link.href);
            //this.handles.storyEditor.removeVariableInject();
        },

        saveStoryToProfile(){
            var cloudStory = this.handles.storyEditor.generateSaveStory();
            this.handles.fileConverter.story = cloudStory;
            var tweeBlob = this.handles.fileConverter.twee();

            var d = new Date()
            var draftObj = {'text': tweeBlob, 'dateUpdated': d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear(), 'OGstory': sessionStorage.getItem("OGstoryPassages")}
            if(db.ref('accounts/' + firebase.auth().currentUser.uid + '/drafts/' + this.handles.storyEditor.baseStory.name)){
                db.ref('accounts/' + firebase.auth().currentUser.uid + '/drafts/' + this.handles.storyEditor.baseStory.name).update(draftObj);
            }
            else{
                db.ref('accounts/' + firebase.auth().currentUser.uid + '/drafts/' + this.handles.storyEditor.baseStory.name).push(draftObj)
            }
            alert('Your story was saved successfully!')
        },

        getExportFile(){
          var cloudStory = this.handles.storyEditor.generatePublishStory();
          this.handles.fileConverter.story = cloudStory;
          var tweeBlob = this.handles.fileConverter.twee();
          this.$store.commit('updateStoryPublish', tweeBlob);
        },

        downloadStory: function(){
            var storyView = this.handles.storyEditor.generateViewStory(true);
            this.handles.fileConverter.story = storyView;
            var htmlBlob = this.handles.fileConverter.html(this.handles.storyEditor.css, "");

            storyView = this.handles.storyEditor.generateSaveStory();
            this.handles.fileConverter.story = storyView;
            var tweeBlob = this.handles.fileConverter.twee();

            var zip = new JSZip();
            zip.file(this.storyName + ".html", htmlBlob);
            zip.file(this.storyName + ".twee", tweeBlob);
            zip.file("readMe.txt", "To view the story, double click on the html file.\nIf the user wants to re-edit the story, they must upload the .twee file to our website.\nCreate an account to save stories, download stories and more!")

            var name = this.storyName;

            zip.generateAsync({type:"blob"})
                .then(function(content) {
                    // see FileSaver.js 
                    FileSaver.saveAs(content, name + ".zip");
            });
                //this.handles.fileConverter.html(event.css, event.js);
        },

        viewStoryHTML: function(){
            var storyView = this.handles.storyEditor.generateViewStory(true);
            this.handles.fileConverter.story = storyView;

            //this.handles.fileConverter.html(event.css, event.js);

            var htmlBlob = this.handles.fileConverter.html(this.handles.storyEditor.css, "");
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([htmlBlob], {type: "text/html"}));
            link.target = "_blank"
            //link.setAttribute('download',  this.handles.storyEditor.baseStory.name + '.html');
            link.click();
            URL.revokeObjectURL(link.href);
            //this.handles.storyEditor.removeVariableInject();
        },

        /*viewHTMLBlob: function(htmlContents){
            const link = document.createElement('a');
            link.href = URL.createObjectURL(new Blob([htmlContents], {type: "text/html"}));
            link.target = "_blank"
            //link.setAttribute('download',  this.handles.storyEditor.baseStory.name + '.html');
            link.click();
            URL.revokeObjectURL(link.href);
        },*/

        publishStoryType: function() {
            var templateChanged = this.checkUniqueStory();
            if (sessionStorage.getItem("createTemplate") === "yes" && templateChanged === true) {
                this.checkUniqueTemplate();
            }
        },

        checkUniqueTemplate: function() {
            let canSubmit = true;
            const Typesense = require('typesense');
            const typesense = new Typesense.Client({
                nodes: [
                {
                    //host: 'localhost',
                    host: 'vcm-15431.vm.duke.edu',
                    port: '8108',
                    protocol: 'https',
                },
                ],
                apiKey: 'YOYCpFLj9u412ihigstCer5Zs2StzptR'
            });
            
            typesense.collections("stories").retrieve().then(data => {
                var numDocs = data.num_documents;
                for (let i = 0; i < numDocs-1; i++) {
                    typesense.collections("stories").documents(i.toString()).retrieve().then(data => {
                        let aFileConverter = new FileConverter(data.text, false);
                        let aStoryEditor = new StoryEditor(aFileConverter.story);
                        var s1 = "";
                        var s2 = "";
                        for (let i = 0; i < aStoryEditor.exportedStoryPages.length; i++) {
                            s1 += aStoryEditor.exportedStoryPages[i].linkPassage.text;
                        }
                        for (let i = 0; i < this.storyPages.length; i++) {
                            s2 += this.storyPages[i].linkPassage.text;
                        }
                        if (aStoryEditor.exportedStoryPages.length < this.storyPages.length) {
                            for (let i = aStoryEditor.exportedStoryPages.length; i < this.storyPages.length; i++) {
                                var indexOpenBrackets = this.storyPages[i].linkPassage.text.indexOf("[[");
                                var indexCloseBrackets = this.storyPages[i].linkPassage.text.indexOf("]]");
                                var cleanStr = this.storyPages[i].linkPassage.text;
                                if (indexOpenBrackets != -1) {
                                    var bracketStr = this.storyPages[i].linkPassage.text.substring(indexOpenBrackets, indexCloseBrackets+2);
                                    cleanStr = this.storyPages[i].linkPassage.text.replace(bracketStr, "");   
                                }
                                if (this.storyPages[i].linkPassage.text.includes("This is a new passage. Edit it to create your own story!") || cleanStr.replace(/\s/g,'') === "") {
                                    alert("Please edit content in new passages.");
                                    return;
                                }
                                s2 += cleanStr;
                            }
                        }
                        var similarityScore = this.similarity(s1, s2);
                        //console.log(similarityScore);
                        if (similarityScore > .75) {
                            canSubmit = false;
                            alert("Story template is too similar to existing template. Please submit a unique story template.");
                            return;
                        }
                        if (similarityScore <= .75 && i === numDocs - 2 && canSubmit === true) {
                            alert("Story template is unique and is ready to be published!");
                            return;   
                        }
                    });
                }
            });
        },

        // Add support for drafts
        checkUniqueStory: function() {
            var s1 = "";
            var s2 = "";
            for (let i = 0; i < JSON.parse(sessionStorage.getItem("OGstoryPassages")).length; i++) {
                s1 += JSON.parse(sessionStorage.getItem("OGstoryPassages"))[i].linkPassage.text;
            }
            for (let i = 0; i < this.storyPages.length; i++) {
                s2 += this.storyPages[i].linkPassage.text;
            }
            if (JSON.parse(sessionStorage.getItem("OGstoryPassages")).length < this.storyPages.length) {
                for (let i = JSON.parse(sessionStorage.getItem("OGstoryPassages")).length; i < this.storyPages.length; i++) {
                    var indexOpenBrackets = this.storyPages[i].linkPassage.text.indexOf("[[");
                    var indexCloseBrackets = this.storyPages[i].linkPassage.text.indexOf("]]");
                    var cleanStr = this.storyPages[i].linkPassage.text;
                    if (indexOpenBrackets != -1) {
                        var bracketStr = this.storyPages[i].linkPassage.text.substring(indexOpenBrackets, indexCloseBrackets+2);
                        cleanStr = this.storyPages[i].linkPassage.text.replace(bracketStr, "");   
                    }
                    if (this.storyPages[i].linkPassage.text.includes("This is a new passage. Edit it to create your own story!") || cleanStr.replace(/\s/g,'') === "") {
                        alert("Please edit content in new passages.");
                        return false;
                    }
                    s2 += cleanStr;
                }
            }
            var similarityScore = this.similarity(s1, s2);
            console.log(similarityScore);
            if (similarityScore > .75) {
                alert("Story is too similar to the original. Please submit a unique story.");
                return false;
            }
            if (sessionStorage.getItem("createTemplate") != "yes") {
                alert("Story is unique and is ready to be published!");
            }
            else {
                return true;
            }
        },

        // Uses Levenshtein distance algorithm 
        similarity: function(s1, s2) {
            var longer = s1.toLowerCase().replace(/\s/g,'');
            var shorter = s2.toLowerCase().replace(/\s/g,'');
            if (s1.length < s2.length) {
                longer = s2;
                shorter = s1;
            }
            var longerLength = longer.length;
            if (longerLength == 0) {
                return 1.0;
            }
            return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
        },

        editDistance: function(s1, s2) {
            var costs = new Array();
            for (var i = 0; i <= s1.length; i++) {
                var lastValue = i;
                for (var j = 0; j <= s2.length; j++) {
                    if (i == 0) {
                        costs[j] = j;
                    }
                    else {
                        if (j > 0) {
                            var newValue = costs[j - 1];
                            if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                                newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                            }
                            costs[j - 1] = lastValue;
                            lastValue = newValue;
                        }
                    }
                }
                if (i > 0) {
                    costs[s2.length] = lastValue;
                }
            }
            return costs[s2.length];
        },

        writeToStorage: function(){
            var storyView = this.handles.storyEditor.generateSaveStory();
            this.handles.fileConverter.story = storyView;

            var tweeBlob = this.handles.fileConverter.twee();
            sessionStorage.setItem("storyContent", tweeBlob);
            sessionStorage.setItem("storyLocation", "");

            //this.handles.storyEditor.removeVariableInject();

            this.handles.storyEditor.generateStoryText(this.renderHints.hidden, this.renderHints.inVariableEditor, this.renderHints.inMediaEditor);
            this.storyVariables = this.handles.storyEditor.variables;
            this.imageVariables = this.handles.storyEditor.imageVariables;
            this.audioVariables = this.handles.storyEditor.audioVariables;
            this.storyPages = this.handles.storyEditor.exportedStoryPages;
            this.storyName = this.handles.storyEditor.baseStory.name;
        },

        checkRenderHints: function(){
            if(this.renderHints.renderKey > 10){
                this.renderHints.renderKey = 1;
            }

            if(this.renderHints.variableRenderKey > 10){
                this.renderHints.variableRenderKey = 1;
            }

            if(this.renderHints.themesRenderKey > 10){
                this.renderHints.themesRenderKey = 1;
            }

            if(this.renderHints.passageRenderKey > 10){
                this.renderHints.passageRenderKey = 1;
            }

            if(this.renderHints.gsoRenderKey > 10){
                this.renderHints.gsoRenderKey = 1;
            }

            if(this.renderHints.mediaRenderKey > 10){
                this.renderHints.mediaRenderKey = 1;
            }
        },

        hideTools: function(){
            if (this.toolButton == "mdi-minus"){
                this.toolsWidth = "10%";
                this.pageWidth = "90%"
                this.hideItem = true;
                this.toolButton = "mdi-plus";
            }
            else {
                this.toolsWidth = "30%";
                this.pageWidth = "70%"
                this.hideItem = false;
                this.toolButton = "mdi-minus";
            }
        },

        goFullScreen: function(){
            /*
            var storyPage = document.getElementById("storyPage");
            if (!document.fullscreen) {
                storyPage.requestFullscreen();
                this.fullButton = "Exit";
            }
            else {
                document.exitFullscreen();
                this.fullButton = "Full Screen";

            }
            */
            if (!this.inFullMode) {
                this.$emit("evtGoFull");
                this.inFullMode = true;
                this.fullButton = "mdi-fullscreen-exit";
                this.contentHeight = "100vh";
            }
            else {
                this.$emit("evtExitFull");
                this.inFullMode = false;
                this.fullButton = "mdi-fullscreen";
                this.contentHeight = "74vh";
            }
        },

        setMinHeight: function(event){
            this.minHeight = event;
        }
    },

    beforeDestroy: function(){
        console.log("Destroyed");
        this.handles.storyEditor.destroy();
    },

    mixins: [storyMixin, tweeConverter]
}
</script>

<style scoped>
    @keyframes border_anim{
        from{border: solid gray;}
        to{border:solid black;}
	}

    .header {
        text-align: center;
    }

    .uploads {
        text-align: left;
    }
    
    /*
    .editor{
        margin-left: 50px;
        margin-right: 50px;
    }
    */

    #storyPage, #toolBar {
        overflow: auto;
    }

    #page_layout{
        padding-top: 58px;
        overflow: auto;
    }

    .column {
        text-align: center;
        float: left;
        padding: 5px;
    }

    #download_btn{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    #downloadTButton{
		grid-area: downloadT;
		font-size: 20px;
        width: 20%;
	}

	#downloadHButton{
		grid-area: downloadH;
		font-size: 20px;
        width: 20%;
	}

	#viewHButton{
		grid-area: viewH;
		font-size: 20px;
        width: 20%;
	}

    .layoutButton {
		font-size: 50px;
	}

	.layoutButton:hover{
		animation: border_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}
</style>

<style>
* {
  scrollbar-width: 20px;
  scrollbar-color: lightgray transparent;
}

/* Works on Chrome/Edge/Safari */
*::-webkit-scrollbar {
  height: 5px;
  width: 5px;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
*::-webkit-scrollbar-thumb {
  background-color: lightgray;
  border-radius: 20px;
}

*::-webkit-scrollbar-thumb:hover {
    background-color: rgb(200, 200, 200);
    border-radius: 20px;
}
</style>
