<template>
    <div id = "passage_view" v-bind:style = "currPassage == this.name ? 'border: solid brown;': ''">

        <div id = "bar">
            <div id = "delete" v-if = "this.delete">
                <h4 id = "sure">Are You Sure?</h4>
                <v-btn icon id = "cancel_del" v-on:click = "showDelete"><v-icon>mdi-close</v-icon></v-btn>
                <v-btn icon id = "conf_del" v-on:click = "emitDelete"><v-icon>mdi-check</v-icon></v-btn>
            </div>

            <div id = "header" v-if = "!this.delete" :style = "this.editName ? 'grid-template-columns: 1fr 1fr 5fr 1fr;':''">

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"
                            icon id = "goto" v-on:click = "emitGoTo">
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                    </template>
                    <span>Go To "{{name}}"</span>
                </v-tooltip>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs}">
                        <v-btn v-bind="attrs" v-on="on"
                            icon id = "link_list_show" v-on:click = "showList(); editName = false;">
                            <v-icon>{{showLinks ? "mdi-chevron-down":"mdi-chevron-right"}}</v-icon>
                        </v-btn>
                    </template>

                    <span>See Links in "{{name}}"</span>
                </v-tooltip>

                <v-tooltip bottom v-if = "!this.editName">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"
                            icon id = "link_list_show" v-on:click = "addLink">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Add Link To "{{name}}" in displayed passage</span>
                </v-tooltip>

                <button v-if = "!this.editName" class = "sidebar_input no_border bold_text" v-on:click = "showEditName" style = "cursor: pointer;">
                    <h4 v-if = "!this.editName" id = "name">{{this.name}}</h4>
                </button>

                <input class = "sidebar_input bold_text" v-if = "this.editName" v-model = "newNameVal" v-on:keyup.esc = "showEditName" v-on:keyup.enter = "updatePassageName" v-on:blur = "showEditName" />
                
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"
                            icon id = "del" v-on:click = "showDelete(); editName = false;">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Delete</span>
                </v-tooltip>
                
            </div>
        </div>

        <div id = "links" v-if = "this.showLinks" v-bind:key = "this.listRenderKey">
            <list-element v-for = "(link, index) in this.links" v-bind:key = "index" v-bind:select = "false" v-bind:name = "link.name" v-bind:showSelect = "false"
                                                                                v-on:evtRemove = "removeLink"></list-element>

            <label v-if = "this.links.length == 0">No Links in this Passage</label>
        </div>            
        
    </div>
</template>


<script>

import List_Element from "./List_Element.vue"

import Page from "@/js/extwee_utils/Page.js"

export default {
    name: 'passage_view',

    props:{
        page: Page,
        currPassage: String
    },

    components:{
        'list-element': List_Element
    },

    data(){
        return{
            name: this.page.pageName,
            links: this.page.links,
            newNameVal: this.page.pageName,
            prevNameVal: this.page.pageName,

            editName: false,
            showLinks: false,
            delete: false,

            listRenderKey: 0
        }
    },

    methods:{

        emitGoTo: function(){
            this.$emit("evtGoToPage", {name: this.name});
        },

        emitDelete: function(){
            this.$emit("evtDelete", {name: this.name});
        },

        removeLink: function(event){

            this.links = this.links.filter(function(link){
                return link.name != event;
            });

            this.$emit("evtRemoveLink", {name: this.name, removeLink: event});

            this.listRenderKey++;
            this.checkRenderHints();
        },

        addLink: function(){
            this.$emit("evtAddLink", {name: this.name});
        },

        showList: function(){
            this.showLinks = !this.showLinks;
        },

        showEditName: function(){
            this.editName = !this.editName;

            if(!this.editName){
                this.newNameVal = this.prevNameVal;
            }
        },

        showDelete: function(){
            this.delete = !this.delete;
        },

        updatePassageName: function(){

            var process = true;

            for(var i = 0; i < this.page.story.passages.length; i++){
                if(this.page.story.passages[i].name == this.newNameVal && this.newNameVal != this.prevNameVal){
                    process = false;
                }
            }

            if(process){
                this.$emit("evtNewPassageName", {prevName: this.name, newName: this.newNameVal});
                this.editName = !this.editName;
                this.prevNameVal = this.newNameVal;
            } else{
                alert("Name already exists");
            }
        },

        checkRenderHints: function(){
            if(this.listRenderKey > 10){
                this.listRenderKey = 0;
            }
        }
    }
}
</script>

<style scoped>

	
    @keyframes input_anim{
        from{border-bottom: solid lightgray; border-width: 1px;}
        to{border-bottom:solid gray; border-width: 1px;}
	}

	.sidebar_input{
		width: 100%;
		border-bottom: solid lightgray;
		border-width: 1px;
		text-align: center;
		border-radius: 5px;
		outline:none;
	}

	.sidebar_input:hover{
		border-width: 1px;
		border-radius: 5px;
		animation: input_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}

	.no_border{
		border: solid 1px transparent;
		border-radius: 0px;
	}

    .bold_text{
        font-size: 15px;
		font-weight: bold;
    }

    #passage_view{
        display:flex;
        flex-direction:column;
        justify-content: space-around;
        
        padding: 5px;

        border: solid lightgray;
		border-radius: 5px;
		border-width: 2px;
    }

    #links{
        padding: 5px;

        border: solid lightgray;
		border-radius: 5px;
		border-width: 1px;
    }

    #header{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr 4fr 1fr;
    }

    #delete{
        display:grid;
        grid-template-columns: 6fr 1fr 1fr;
    }

    #passageName{
        border: solid lightgray;
		border-radius: 5px;
		border-width: 1px;

		text-align: center;

		font-size: 15px;
		font-weight: bold;
    }

    #sure{
        padding-top:0.45rem;
    }

    button{
        outline:none;
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

    
</style>