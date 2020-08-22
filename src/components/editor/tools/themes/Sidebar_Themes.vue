<template>
    <div class = "themes_sidebar">
        <h3 id = "header">Themes</h3><br>
        
        <div id = "themes">
            <div id = "show_buttons">
                <button id = "show_themes" class = "sidebar_button" v-on:click = "toggleThemeDisplay"><v-icon>{{this.displayThemes ? "mdi-chevron-down": "mdi-chevron-right"}}</v-icon>Show Themes</button>
                <button id = "new_theme" class = "sidebar_button" v-on:click = "showNew"><v-icon>mdi-plus</v-icon> New Theme</button>
            </div>
            
            <div id = "add_new_theme">    
                <div v-if = "this.newTheme" id = "new_theme_props">
                    <label id = "theme_name">Theme Name:</label>
                    <input id = "new_theme_name" class = "input" v-model = "newThemeName" type = "text" placeholder = " myTheme"/>    

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <button v-bind="attrs" v-on="on"
                                id = "cancel_new_theme" class = "sidebar_button" 
                                v-on:click= "showNew">
                                <v-icon>mdi-close</v-icon>
                            </button>
                        </template>
                        <span>Cancel</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                            <button v-bind="attrs" v-on="on"
                                id = "confirm_new_theme" class = "sidebar_button" 
                                v-on:click= "addNewTheme">
                                <v-icon>mdi-check</v-icon>
                            </button>
                        </template>
                        <span>Submit</span>
                    </v-tooltip>
                </div>
            </div>

            <div v-if = "this.displayThemes" id = "list" v-bind:key = "this.listRenderKey">
                
                <label v-if = "this.themes.size == 0">No Themes</label>

                <list-element v-for = "(theme, index) in this.themes.keys()" v-bind:key = "index" v-bind:select = "true" v-bind:name = "theme" v-bind:showSelect = "false"
                                                                                v-on:evtRemove = "removeTheme"
                                                                                v-on:evtSelect = "selectTheme"
                                                                                v-on:evtSelectAll = "selectAllTheme"></list-element>
            </div>
        </div>

        <color-picker class="color_input" purpose = "Change Background Color" :initColor = "background" v-on:evtColorChange = "updateBackgroundColor"/>        
        <color-picker class="color_input" purpose = "Change Text Color" :initColor = "text" v-on:evtColorChange = "updateTextColor"/>
    </div>
</template>

<script>
import Color_Picker from "./Color_Picker.vue"
import List_Element from "./List_Element.vue"

export default {
    name: "themes-sidebar",

    components:{
        'color-picker': Color_Picker,
        'list-element': List_Element
    },

    props: {
        backgroundColor: String,
        textColor: String
    },

    data() {
        return{
            background: this.backgroundColor,
            text: this.textColor,

            themes: Map,
            newThemeName: "",
            newTheme: false,

            showAlert: false,
            displayThemes: false,
            selectedTheme: "Basic",

            listRenderKey: 0,
        }
    },
    
    methods: {
        emitColor: function() {
            // console.log(this.background);
            this.$emit("evtNewTheme", {bgColor: this.background, textColor: this.text});
        },

        updateBackgroundColor: function(event) {
            this.background = event;
            this.emitColor();
        },

        updateTextColor: function(event) {
            this.text = event;
            this.emitColor();
        },

        showNew: function() {
            this.newTheme = !this.newTheme;
        },
        
        addNewTheme: function() {
            this.themes = this.themes.set(this.newThemeName, {bgColor: this.background, textColor: this.text});
            this.newTheme = false;
            this.listRenderKey++;
            this.checkRenderHints();
        },

        selectTheme: function(event){
            this.background = this.themes.get(event.name).bgColor;
            this.text = this.themes.get(event.name).textColor;

            this.selectedTheme = event.name;

            this.emitColor();
        },

        selectAllTheme: function(event){
            this.background = this.themes.get(event.name).bgColor;
            this.text = this.themes.get(event.name).textColor;

            this.selectedTheme = event.name;

            this.$emit("evtNewThemeAll", {bgColor: this.background, textColor: this.text});
        },

        removeTheme: function(event){
            this.themes.delete(event);
            this.listRenderKey++;
            this.checkRenderHints();
        },

        toggleThemeDisplay: function() {
            this.displayThemes = !this.displayThemes;
        },

        checkRenderHints: function() {
            if(this.listRenderKey > 10){
                this.listRenderKey = 1;
            }
        }
    },

    created: function() {
        this.themes = new Map();
        this.themes.set("Basic", {bgColor: "#FFFFFF", textColor: "#000000"});
    }
}
</script>

<style scoped>
    #themes_sidebar{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #header {
        text-align: center;
    }

    .color_input{
        width: 100%;
    }

    button{
        outline: none;
    }

    #themes{
        padding: 5px;
        border: solid lightgray;
        border-radius: 5px;
        border-width: 2px;

    }

    #show_buttons{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    #add_new_theme{
        padding: 5px;
        border: solid lightgray;
        border-radius: 5px;
        border-width: 1px;
    }

    #new_theme_props{
        width: 100%;

        display: grid;
        grid-template-areas: 
                "label1 input1"
                "cancel submit";
        grid-template-columns: 1fr 1fr;
        row-gap: 15px;
        column-gap: 10px;

        padding: 10px;
        text-align: center;
    }

    #theme_name{
        grid-area: label1;
    }

    #new_theme_name{
        grid-area: input1;
    }

    #confirm_new_theme{
        grid-area: submit;
    }

    #cancel_new_theme{
        grid-area: cancel;
    }

    #list{
        border: solid lightgray;
        border-radius: 5px;
        border-width: 1px;
        
        padding: 5px;
    }

    .input {
        border-radius: 5px;
        border-width: 2px;
        border-style: solid;
        border-color: lightgray;
        width: 100%;
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