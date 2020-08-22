<template>
    <div id = "list_elem">
        <div id = "header">
            <button id = "edit_var_name" class = "sidebar_input no_border" v-if = "!this.editName" v-on:click = "showEditVarName">
                <span id = "var_name" :style = '"color:" + this.varColor + ";"'>
                    <strong>{{this.newVarName}}</strong>
                </span>
            </button>

            <div id = "view_file" v-if = "!this.editName && this.newFileName != ''" style = "padding-top: 5px;">

                <div class = "input_field sidebar_input" v-if = "this.type.includes('image')">
                    <label class = "upload_btn" v-if = "!this.editName">{{this.newFileName}}
                        <input type="file" accept="image/*" @change = "emitNewFile">
                    </label>
                </div>

                <div class = "input_field sidebar_input" v-if = "this.type.includes('audio')">
                    <label class = "upload_btn" v-if = "!this.editName">{{this.newFileName}}
                        <input type="file" accept="audio/*" @change = "emitNewFile">
                    </label>
                </div>

            </div>

            <div id = "inputs" v-if = "!this.editName && this.newFileName == ''" style = "padding-top: 5px;">
                <div class = "sidebar_input" v-if = "!this.editName && this.type.includes('audio')">
                    <label class = "upload_btn sidebar_input"><v-icon>mdi-upload</v-icon> Upload {{this.type}}
                        <input type="file" accept="audio/*" @change = "emitNewFile">
                    </label>
                </div>

                <div class = "sidebar_input" v-if = "!this.editName && this.type.includes('image')">
                    <label class = "upload_btn"><v-icon>mdi-upload</v-icon> Upload {{this.type}} 
                        <input type="file" accept="image/*" @change = "emitNewFile">
                    </label>
                </div>
            </div>

            <div class = "options" v-if = "!this.editName && !this.deleteOptions">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"
                            id = "list_delete" icon
                            v-on:click = "viewDelete">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    <span>Delete Media Variable</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"
                            id = "list_select" icon
                            v-on:click = "emitAdd">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    <span>Add Media To Current Page</span>
                </v-tooltip>
            </div>

            <div class = "confirm" v-if = "!this.editName && this.deleteOptions" style = "display:inline block;">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" 
                            id = "list_revert" icon class = "cancel_button"
                            v-on:click = "viewDelete" >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                    <span>Cancel</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" 
                            id = "list_permadelete" icon class = "confirm_button"
                            v-on:click = "emitDelete" >
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </template>
                    <span>Confirm</span>
                </v-tooltip>
            </div>
        </div>

        <div id = "edit_name" v-if = "this.editName">
            <!-- "color:" + this.varColor + "; -->
            <input class = "n_var" v-model = "newVarName" :style = '"font-weight: bold;"' 
                v-on:keyup.enter = "emitNewVarName" v-on:keyup.esc = "showEditVarName">
            
            <div class = "confirm">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" 
                            id = "var_button_cancel_edit" icon class = "cancel_button"
                            v-on:click = "showEditVarName" >
                            <v-icon>mdi-pencil-off</v-icon>
                        </v-btn>
                    </template>
                    <span>Cancel</span>
                </v-tooltip>
                
                <v-tooltip bottom> 
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on"
                            id = "var_button_confirm_edit" icon class = "confirm_button"
                            v-on:click = "emitNewVarName">
                            <v-icon>mdi-check-bold</v-icon>
                        </v-btn>
                    </template>
                    <span>Confirm</span>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'sidebar-element',
    
    props: {
        fileName: String,
        variableName: String,
        varColor: String,
        type: String,
    },

    data() {
        return {
            newFileName: this.fileName,
            newVarName: this.variableName.replace("@", ""),
            prevVarName: this.variableName.replace("@", ""),
            editName: false,
            deleteOptions: false,
        }
    },

    methods: {
        showEditVarName: function() {
            this.editName = !this.editName;

            if(!this.editName){
                this.newVarName = this.prevVarName;
            }
        },

        viewDelete: function() {
            this.deleteOptions = !this.deleteOptions;
        },

        emitAdd: function() {
            this.$emit("evtAdd", {name: '@' + this.newVarName, fileName: this.fileName});
        },

        emitDelete: function() {
            this.$emit("evtDelete", {name: '@' + this.newVarName, fileName: this.fileName});
            this.deleteOptions = false;
        },

        emitNewVarName: function() {
            this.$emit("evtNewVarName", {prevName: '@' + this.prevVarName, newName: '@' + this.newVarName, fileName: this.fileName});
            this.prevVarName = this.newVarName;

            this.editName = false;
        },

        emitNewFile: function(event) {
            var newFile = event.target.files[0];
            this.$emit("evtReplaceFile", {name: '@' + this.newVarName, oldFileName: this.fileName, newFile: newFile});
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

    #list_elem {
        align-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    #header {
        display: grid; 
        grid-template-areas:
            "name file options";
        grid-template-columns: 3fr 4fr 2fr;
    }

    #var_name {
        grid-area: name;
    }

    #view_file {
        grid-area: file,
    }

    #inputs {
        grid-area: file,
    }

    .input_field {
        grid-area: file;
        width: 150px;
        white-space: nowrap;
        overflow-x: auto;   
    }

    .upload_btn {
        cursor: pointer;
    }

    input[type="file"] {
        display: none;
    }

    .options {
        grid-area: options;
		display: grid;
		grid-template-areas: 
			"del plus";
		grid-template-columns: 1fr 1fr;
		padding-left: 2px;
		padding-right: 2px;
        height: 100%;
	}

    #list_delete {
        height: 100%;
		grid-area: del;
    }

    #list_select {
        height: 100%;
		grid-area: plus;
    }
    
    #edit_name {
		display: grid;
        grid-template-areas: "name options";
		grid-template-columns: 7fr 2fr;
		padding-left: 2px;
		padding-right: 2px;
        width: 100%;
        height: 50px;
    }

    .n_var {
        grid-area: name;
		border: solid lightgray;
		border-width: 1px;
		text-align: center;
		border-radius: 5px;
	}

    .confirm {
        grid-area: options;
		display: grid;
		grid-template-areas: 
			"canc conf";
		grid-template-columns: 1fr 1fr;
		padding-left: 2px;
		padding-right: 2px;
        height: 100%;
	}

    .confirm_button {
        height: 100%;
		grid-area: conf;
	}

	.cancel_button {
        height: 100%;
		grid-area: canc;
	}

    button {
        outline: none;
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