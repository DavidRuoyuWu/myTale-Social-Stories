<template>
    <div id = "upload_list">
        <div id = "flex_div">
            <button id = "list_view" class = "sidebar_button" v-on:click = "listView">{{this.purpose}}
                <v-icon>{{this.showList ? "mdi-chevron-down": "mdi-chevron-right"}}</v-icon>
            </button>

            <label id = "upload_btn" class = "sidebar_button">Upload {{this.purpose}}   <v-icon>{{this.icon}}</v-icon>
                <input type="file" @change = "emitNewVariables" multiple :accept = "this.filesAccepted">  
            </label>
        </div>

        <div v-if = "this.showList" id = "list_div" style = "padding-top: 5px; padding-bottom: 5px;" :key = "renderKey">
            <label v-if = "this.varMap.size==0">No Uploaded Files</label>
            <sidebar-element class = "list_element" v-for = "(key, index) in this.sortedKeys" :key = "index"
                v-bind:fileName = "varMap.get(key).fileName" v-bind:variableName = "key"
                v-bind:type = "type"
                v-bind:varColor = "varMap.get(key).color"
                v-on:evtAdd = "addElement" v-on:evtDelete = "removeElement"
                v-on:evtNewVarName = "updateVarName" v-on:evtReplaceFile = "replaceFile">
            </sidebar-element>
        </div>
    </div>
</template>

<script>
import Sidebar_Element from "./Sidebar_Element.vue"

export default {
    name: 'upload-list',

    components: {
        'sidebar-element': Sidebar_Element,
    },

    props: {
        purpose: String,
        varMap: Map
    },

    data() {
        return {
            icon: 'mdi-upload',
            
            // newFiles: [], // File
            numVarsEmitted: 1,

            type: '',

            showList: true,

            filesAccepted: '',

            renderKey: 1,
        }
    },

    created: function() {
        if(this.purpose.includes("Images")) {
            this.icon = 'mdi-image-area';
            this.filesAccepted = 'image/*';
            this.type = "image";
        }
        if(this.purpose.includes("Audio")) {
            this.icon = 'mdi-volume-high'
            this.filesAccepted = 'audio/*';
            this.type = "audio";
        }
    },

    computed:{
        sortedKeys: function(){
            var sortedKeys = [];
            var variables = this.varMap;

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
        },
    },

    methods: {
        listView: function() {
            this.showList = !this.showList;
        },

        // event: upload event
        emitNewVariables: function(event) {
            var filesToEmit = [];

            console.log("Emitting new Variables: " + event.target.files.length);
            
            var alertText = "";

            for(var j = 0; j < event.target.files.length; j++){

                if(!this.containsFile(event.target.files[j])){
                    filesToEmit.push(event.target.files[j]);
                } else {
                    alertText += " " + event.target.files[j].name + " ";
                }
            
            }

            if(alertText.length != 0){
                alertText = "You have already uploaded " + alertText;
                alert(alertText);
            }

            var varArr = [];

            for(var i = 0; i < filesToEmit.length; i++){
                var newVar = {name: "@"+ this.type + ((this.numVarsEmitted) + this.varMap.size), file: filesToEmit[i], fileName: filesToEmit[i].name, path: {i: URL.createObjectURL(filesToEmit[i])}, color: "", id: 0, uploaded: false};
                
                while(this.containsVar("@"+ this.type + ((this.numVarsEmitted++) + this.varMap.size))){
                    newVar.name = "@"+ this.type + ((this.numVarsEmitted) + this.varMap.size);
                }
                
                varArr.push(newVar);
            }

            if(varArr.length > 0)
                this.$emit("evtNewMediaVariables", varArr);
        },

        // event: {name, fileName}
        addElement: function(event) {
            this.$emit("evtAdd", event);
        },

        // event: {name, fileName}
        removeElement: function(event) {
            console.log("Deleting: " + JSON.stringify(event));
            var file = this.varMap.get(event.name);

            this.$emit("evtDelete", {name: event.name, fileName: event.fileName, file: file});
        },

        // event: {prevName, newName}
        updateVarName: function(event) {
            // ensure newVarName is not already in use
            if(event.prevName == event.newName){
                return;
            }

            if(event.newName == ""){
                alert("Please enter something!");
                return;
            }

            if(this.containsVar(event.newName)) {
                alert("The variable name " + event.newName + " is already being used! Please pick another name.");
                this.renderKey++;

                if(this.renderKey > 10){
                    this.renderKey = 0;
                }
                return;
            }

            this.$emit("evtNewVarName", event);
        },

        // event: {name, oldFileName, newFile}
        replaceFile: function(event) {
            var newFile = event.newFile;
            var oldData = JSON.parse(JSON.stringify(this.varMap.get(event.name)));

            // ensure file has not already been uploaded
            if(this.containsFile(newFile)) {
                alert("You've already uploaded " + newFile.name + "!");
                return;
            }

            var data = this.varMap.get(event.name);

            data.file = event.newFile;
            data.fileName = event.newFile.name;


            URL.revokeObjectURL(data.path.i);

            data.path = {i: URL.createObjectURL(event.newFile)};

            this.$emit("evtReplaceFile", {name: event.name, oldData: oldData, data: data});
        },

        containsFile: function(file) {
            var ret = false;
            
            this.varMap.forEach(function(data){
               if(data.fileName == file.name){
                   ret = true;
               } 
            });

            return ret;
        },

        containsVar: function(varName){
            var ret = false;

            this.varMap.forEach(function(data, key){
               if(key == varName){
                   ret = true;
               } 
            });

            return ret;
        }
    }
}
</script>

<style scoped>
    #upload_list{
        display: block;
        border: solid lightgray;
        border-radius: 5px;
        border-width: 2px;
    }

    #flex_div{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
    }

    #list_div{
        display: flex;
        flex-direction: column;
        border: solid lightgray;
        border-radius: 5px;
        border-width: 1px;
    }

    #list{
        text-align: center;
    }

    #list_view{
        width: 40%;
    }

    input[type="file"] {
        display: none;
    }

    button{
        outline: none;
    }

    ul{
        list-style: none;
        text-align: center;
    }

    #upload_btn {
        cursor: pointer;
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