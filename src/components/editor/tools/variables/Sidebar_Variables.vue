<template>
    <div id = "var_sidebar">

         <div id = "header" style = "display:grid; grid-template-columns: 10fr 1fr; text-align:center;">
            <h3 style = "padding-top: 5px;">Text Variables</h3>
            <v-btn icon id = "hide" v-on:click = "emitDispVars"><v-icon>{{this.hidden ? 'mdi-eye':'mdi-eye-off'}}</v-icon></v-btn>
        </div><br>
        
        <div id = "var_editors" v-bind:key = "this.renderKey">
            <var-editor class = "var_editor" v-for = "(nVar, index) in this.sortedKeys" v-bind:key = "index"
                                v-bind:varName = "nVar" 
                                v-bind:varColor = "storyVars.get(nVar).color"
                                v-bind:initVarVal = "storyVars.get(nVar).value" 
                                v-on:evtGetNextValue = "emitVarValueChange"
                                v-on:evtDelete = "emitVarDelete"
                                v-on:evtNewVarName = "emitVarNameChange"></var-editor>
        </div>

        <br>

        <button class = "sidebar_button" id = "addButton" v-on:click = "showAdd"><v-icon>mdi-plus</v-icon>
            New Variable</button>
        <br><br>

        <div v-if = "this.add">
            <v-combobox outlined dense hide-details label="Variable Name" v-model="newVarName" placeholder="myVar" :items="this.myVarNames" id="newVarName" @change="autofillVar"></v-combobox>

            <v-combobox outlined dense hide-details label="Value" v-model="newVarValue" placeholder="value" id="newVarVal" class="mt-4 mb-1"></v-combobox>
            
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <button v-bind="attrs" v-on="on"
                        class = "sidebar_button" id = "cancel_new_var"
                        v-on:click= "showAdd">
                        <v-icon>mdi-close</v-icon>
                    </button>
                </template>
                <span>Cancel</span>
            </v-tooltip>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <button v-bind="attrs" v-on="on"
                        class = "sidebar_button" id = "confirm_new_var"
                        v-on:click= "emitNewVar">
                        <v-icon>mdi-check</v-icon>
                    </button>
                </template>
                <span>Submit</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
//import firebase from 'firebase'
import firebaseMixin from '@/mixins/firebaseMixin'
import Variable_Editor from "./Variable_Editor"

export default {
    name: "var-sidebar",
    
    props:{
        storyVars: Map
    },

    data() {
        return {
            hidden: true,
            add: false,
            newVarName: "",
            newVarValue: "",

            myProfile: [],
            myVarNames: [],

            renderKey: 0,
        }
    },

    components: {    
        'var-editor': Variable_Editor
    },

    computed:{
        sortedKeys: function(){
            
            var sortedKeys = [];
            var variables = this.storyVars;

            if(variables != null){
                variables.forEach(
                    function(value, key){
                        sortedKeys.push(key);
                    }
                );

                sortedKeys = sortedKeys.sort(function(a, b){
                    var idA = variables.get(a).id;
                    var idB = variables.get(b).id;

                    return idA - idB;
                });
            }

            return sortedKeys;
		}
    },
    
    methods: {
        emitDispVars: function() {
            this.hidden = !this.hidden;
            this.$emit("evtDispVars", {disp: this.hidden});
        },

        emitVarValueChange: function(event) {
            this.$emit("evtVarValueChange", event);
        },

        emitVarDelete: function(event){
            this.$emit("evtDelete", event);
        }, 

        emitVarNameChange: function(event){
            if(event.newName == ""){
                alert("Please enter something!");
                return;
            }

            if(this.sortedKeys.includes(event.newName)){
                alert("The variable name " + event.newName + " is already being used! Please pick another name.");
                this.renderKey++;

                if(this.renderKey > 10){
                    this.renderKey = 0;
                }
                return;
            }

            this.$emit("evtVarNameChange", event);
        },

        showAdd: function() {
            this.add = !this.add;
        },

        emitNewVar: function() {
            var x = document.getElementById("newVarName");
            var y = document.getElementById("newVarVal");
            this.newVarName = x.value;
            this.newVarValue = y.value;
            this.add = !this.add;
            this.$emit("evtNewVar", { name: '$' + this.newVarName, value: this.newVarValue } );
            this.newVarName = "";
            this.newVarValue = "";
        },

        autofillVar: function() {
            var i;
            for (i=0; i<this.myVarNames.length; i++) {
                if (this.newVarName === this.myVarNames[i]) {
                    this.newVarValue = this.myProfile[i];
                    return;
                }
            }
        },
    },

    created() {
        //this.userID = firebase.auth().currentUser.uid;
        //this.myProfile = this.getVarVals(this.userID);
        //this.myVarNames = this.getVarNames(this.userID);
    },
    mixins: [firebaseMixin]
}
</script>

<style scoped>
    #title{
        display: inline-block;
    }

    .emitter{
        display: inline-block;
        position: absolute;
        left: 85%;
        top: 2%;
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
    #var_sidebar {
        border-width: 2px;
        border: black;
        text-align: center;
    }

    #var_editors{
        border-width: 1px;
        border: solid lightgray;
        border-radius: 5px;
        padding: 5px;
        text-align: center;
    }

    .var_editor{
        padding: 5px;
    }

    ul{
        list-style-type: none;
    }

    #addButton {
        text-align: left;
    }

    #newVar {
        text-align: left;
    }

    .input {
        border-radius: 5px;
        border-style: solid;
        border-color: lightgray;
        width: 100%;
    }

    button{
        outline: none;
    }

    @keyframes border_anim{
        from{border: solid white;}
        to{border:solid #F05E23;}
	}

    .sidebar_button{
		border: solid white;
        border-width: 3px;
		border-radius: 5px;
        padding: 2px;
	}

	.sidebar_button:hover{
        border-width: 2px;
        border-radius: 5px;
        padding: 2px;
		animation: border_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}

    .spacing {
        width: 100%;
        height: 5px;
    }

</style>