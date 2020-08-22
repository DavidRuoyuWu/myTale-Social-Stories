<template>
    <div id = "gso"> 

        <div id = "story_options" :style = "minimized ? 'grid-template-columns: 1fr': 'grid-template-columns: 1fr 10fr 5fr'">

            <v-tooltip bottom v-if = "!minimized">
                <template v-slot:activator="{ on, attrs }">
                        <v-btn v-on = "on" v-bind = "attrs"  id = "upload_btn" icon v-on:click = "uploadFiles"><v-icon>mdi-upload</v-icon></v-btn>
                </template>
                <span>Upload New Story</span>
            </v-tooltip>
           
            <input ref = "uploader" v-if = "!minimized" type="file" @change = "emitFiles" accept = ".twee" style = "display: none;" > 

            <button :disabled = "minimized" v-if = "!this.editName" :class = "minimized ? '':'border_button'" v-on:click = "showEditName" style = "cursor: pointer;">
                <h4 :style = "minimized ? 'font-size: 15px; font-weight: bold;': ''" v-if = "!this.editName" id = "name">{{this.newNameVal}}</h4>
            </button>

            <input id = "passageName" v-if = "this.editName && !minimized" v-model = "newNameVal" v-on:blur = "updateStoryName" v-on:keyup.esc = "showEditName" v-on:keyup.enter = 'updateStoryName'/>
            
            <div id = "button_section" v-if = "!minimized">

                <div id = "confirm_edit" class = "flex_disp" v-if = "editName">
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind = "attrs" v-on = "on" id = "cancel" class = "expander" icon v-on:click = "showEditName"><v-icon>mdi-pencil-off</v-icon></v-btn>
                            </template>
                            <span>Cancel</span>
                        </v-tooltip>
                    </div>
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn v-bind = "attrs" v-on = "on" id = "confirm" class = "expander" icon v-on:click = "updateStoryName"><v-icon>mdi-check-bold</v-icon></v-btn>
                            </template>
                            <span>Confirm</span>
                        </v-tooltip>
                    </div>
                </div>

                
                <div id = "condensed_options" class = "flex_disp" :style = "minimized ? '': ''" v-else>

                    <v-tooltip bottom v-if = "showOptions && loggedIn">
                        <template v-slot:activator="{ on, attrs}">
                            <v-btn v-bind = "attrs" v-on = "on" class = "expander" id = "downloadStory" v-on:click = "downloadStory" icon><v-icon>mdi-download</v-icon></v-btn>
                        </template>
                        <span>Download Story</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind = "attrs" v-on = "on" id = "viewStory" class = "expander" icon v-on:click = "viewStoryHTML"><v-icon>mdi-eye</v-icon></v-btn>
                        </template>
                        <span>View Story</span>
                    </v-tooltip>

                    <v-tooltip bottom v-if = "loggedIn && !minimized">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind = "attrs" v-on = "on" id = "saveStory" class = "expander" icon v-on:click = "saveStoryToProfile"><v-icon>mdi-content-save</v-icon></v-btn>
                        </template>
                        <span>Save Story</span>
                    </v-tooltip>

                    <v-tooltip bottom v-if = "showOptions && loggedIn && !minimized">
                        <template v-slot:activator="{ on, attrs }" class = "publish">
                            <router-link :to="{name: 'addStory'}">
                              <v-btn v-bind = "attrs" v-on = "on" id = "publishStory" class = "expander" icon v-on:click = "publishStory">
                                <v-icon>mdi-cloud-upload</v-icon>
                              </v-btn>
                            </router-link>
                        </template>
                        <span>Publish Story</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">  
                            <v-btn :small = "minimized" v-bind = "attrs" v-on = "on" id = "moreOptions" icon class = "expander" v-on:click = "emitCreateNewStory"><v-icon>mdi-refresh</v-icon></v-btn>
                        </template>
                        <span>Create New Story</span>
                    </v-tooltip>




                </div>                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'global-story-options',

    props:{
        isLoggedIn: Boolean,
        storyName: String,
        minimized: Boolean
    },

    data(){
        return{
            showOptions: true,
            editName: false,

            newNameVal: this.storyName,
            prevNameVal: this.storyName,

            theBool: false,
        }
    },

    computed:{
        loggedIn: function(){
            if(this.isLoggedIn){
                return true;
            } else {
                return false;
            }
        }
    },

    methods: {
        downloadStory: function(){
            this.$emit("evtDownloadStory");
        },

        viewStoryHTML: function(){
            this.$emit("evtViewHTML");
        },

        showEditName: function(){
            this.editName = !this.editName;

            if(!this.editName){
                this.newNameVal = this.prevNameVal;    
            }

        },

        updateStoryName: function(){

            this.prevNameVal = this.newNameVal;

            this.$emit("evtNewStoryName", {name: this.newNameVal});

            this.editName = false;
        },

        saveStoryToProfile: function(){
            this.$emit("evtSave");
        },

        publishStory: function(){
            this.$emit("evtPublish");
        },

        emitCreateNewStory: function(){
            this.$emit("evtCreateNewStory");
        },

        viewOptions: function(){
            this.showOptions = !this.showOptions;
        },

        uploadFiles: function(){
            this.$refs.uploader.click();
        },

        emitFiles: function(event){
            this.$emit("evtNewStory", event.target.files);
        }
    }
}
</script>

<style scoped>
#gso{

    padding: 10px;

    border-bottom: solid 2px lightgray;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

#story_options{
    display: grid;
    grid-template-columns: 1fr 10fr 4fr;
}

#user_options{
    display:flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 15px;
}

#passageName{
    border-bottom: solid 3px orangered;
    text-align: center;
    font-weight: bold; 
    outline:none;
}

.flex_div{
    text-align: center;
    width: 200px;
}

.flex_disp{
    display:flex;
    flex-direction:row;
    justify-content: space-around;
}

.grid_disp{
    display:grid;
    grid-template-columns: 1fr 1fr;
    text-align: center;
}

button{
    outline:none;
}

a{
  text-decoration: none;
}

</style>