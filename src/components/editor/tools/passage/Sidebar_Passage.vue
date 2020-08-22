<template>
    <div id = "passage_sidebar">
        <h3>Passages</h3>
        
        <br>

        <div id = "passages">
            <passage-view v-for = "(page, index) in this.pages" v-bind:key = "index" v-bind:currPassage = "currPassage"
                                                                v-bind:page = "page"
                                                                v-on:evtNewPassageName = "emitNewPassageName"
                                                                v-on:evtGoToPage = "emitGoToPage"
                                                                v-on:evtAddLink = "emitAddLink"
                                                                v-on:evtRemoveLink = "emitRemoveLink"
                                                                v-on:evtDelete = "emitDelete"></passage-view>
        </div>
        
        <br>

        <button class = "sidebar_button" v-on:click = "showCreate"><v-icon>mdi-plus</v-icon> New Passage</button><br><br>

        <div v-if = "this.create" id = "newPassage">
            <label v-if = "this.create" id = "new_name">New Passage Name:</label>
			<input v-if = "this.create" id = "new_name_val" class = "input" v-model = "newNameValue" type="text" placeholder = " name"/>

            <v-tooltip bottom v-if = "this.create">
                <template v-slot:activator="{ on, attrs }">
                    <button v-bind="attrs" v-on="on"
                        class = "sidebar_button" id = "cancel_new_passage" v-on:click= "showCreate">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </template>
                <span>Cancel</span>
            </v-tooltip>

            <v-tooltip bottom v-if = "this.create">
                <template v-slot:activator="{ on, attrs }">
                    <button v-bind="attrs" v-on="on"
                        class = "sidebar_button" id = "confirm_new_passage" v-on:click= "emitCreateNew">
                        <v-icon>mdi-check</v-icon>
                    </button>
                </template>
                <span>Submit</span>
            </v-tooltip>
        </div>

    </div>
</template>

<script>

import Passage_View from './Passage_View.vue'

export default {
    name: 'sidebar-passage',

    components:{
        'passage-view':Passage_View
    },

    props:{
        storyPages: Array,
        currPassage: String
    },

    data(){
        return{
            pages: this.storyPages,

            create: false,

            newNameValue: ""
        }
    },

    methods:{
        emitNewPassageName: function(event){
            this.$emit("evtNewPassageName", event)
        },

        emitRemoveLink: function(event){
            this.$emit("evtRemoveLink", event)
        },

        emitAddLink: function(event){
            this.$emit("evtAddLink", event)
        },

        emitGoToPage: function(event){
            this.$emit("evtGoToPage", event)
        },

        emitDelete: function(event){
            this.$emit("evtDelete", event);
        },

        emitCreateNew: function(){
            var process = true;
            
			for(var i = 0; i < this.storyPages[0].story.passages.length; i++){
				if(this.newNameValue == this.storyPages[0].story.passages[i].name){
					alert("Passage already exists");
					process = false;
				}
			}

			if(process){
				this.$emit("evtCreateNew", {name: this.newNameValue});
			}
        },

        showCreate: function(){
            this.create = !this.create;
        }
    }
}
</script>

<style scoped>
    #newPassage {
        display: grid;
        grid-template-areas: 
            "nameLabel nameLabel newNameInput newNameInput"
            "cancel cancel done done";
        grid-template-columns: 1fr 1fr 1fr 1fr;
        row-gap: 15px;
        column-gap: 10px;

        border: solid lightgray;
        border-radius: 5px;
        padding: 10px;
    }

    #new_name {
        grid-area: nameLabel;
    }

    #new_name_val {
        grid-area: newNameInput;
    }

    #confirm_new_passage {
        grid-area: done;
    }
    
    #cancel_new_passage {
        grid-area: cancel;
    }

    button {
        outline: none;
    }

    .input {
        border-style: solid;
        border-color: lightgray;
        border-radius: 5px;
    }

    @keyframes border_anim{
        from{border: solid white;        
                border-width: 2px;
                border-radius: 5px;
                padding: 5px;}

        to{border:solid gray;
            border-width: 2px;
            border-radius: 5px;
            padding: 5px;}
        }

    .sidebar_button{
		border: solid white;
        border-width: 2px;
		border-radius: 5px;
        padding: 5px;
	}

	.sidebar_button:hover{
		animation: border_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}

    .spacing {
        width: 100%;
        height: 10px;
    }
</style>