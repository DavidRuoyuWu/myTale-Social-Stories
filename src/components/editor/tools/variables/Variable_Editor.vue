<template>
	<div id="var_editor">
		<div id = "header" v-if = '!this.editVar && !this.editName' style = "display: grid; grid-template-columns: 3fr 4fr 2fr;">
			<button class = "sidebar_input no_border" id = "edit_var_name" v-if = "!this.editName" v-on:click = "showEditVarName">
				<span id = "var_name" :style = '"color:" + this.varColor + ";"'>
					<strong>{{this.editVariableName}}</strong>
				</span>
			</button>

			<button id = "edit_var_val" class = "sidebar_input" v-if = "!this.editVar" v-on:click = "showEditVarValue">
				<span id = "var_val" >
					{{this.editVariableValue}}
				</span>
			</button>

			<div class = "delete">
				<v-tooltip bottom v-if = "!this.delete">
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on"
							id="var_button_delete" 
							v-on:click = "showDelete" 
							icon>
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</template>
					<span>Delete</span>
				</v-tooltip>

				<v-tooltip bottom v-if = "this.delete">
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on"
							id="var_button_confirm" icon
							v-on:click = "emitDelete" >
							<v-icon>mdi-check</v-icon>
						</v-btn>
					</template>
					<span>Confirm</span>
				</v-tooltip>

				<v-tooltip bottom v-if = "this.delete"> 
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on"
							id="var_button_cancel" icon
							v-on:click = "showDelete" >
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</template>
					<span>Cancel</span>
				</v-tooltip>
			</div>
		</div>

		<div id = "edit_name" v-if = "this.editName" style = "display: grid; grid-template-columns: 7fr 2fr;">
			<v-combobox outlined dense hide-details v-model="newVarName" :items="this.myVarNames"
				id="new_var_name"
				v-on:keyup.enter = "emitNewVarName();"
				v-on:keyup.esc = "showEditVarName()"></v-combobox>


			<div class = "confirm">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on"
							id = "var_button_cancel_edit" class = "confirm_button" icon
							v-on:click = "showEditVarName" >
							<v-icon>mdi-pencil-off</v-icon>
						</v-btn>
					</template>
					<span>Cancel</span>
				</v-tooltip>

				<v-tooltip bottom> 
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on"
							id="var_button_confirm_edit" class="cancel_button" icon
							v-on:click = "emitNewVarName" >
							<v-icon>mdi-check-bold</v-icon>
						</v-btn>
					</template>
					<span>Confirm</span>
				</v-tooltip>
			</div>
		</div>

		<div id = "edit_var" v-if = "this.editVar" style = "display: grid; grid-template-columns: 7fr 2fr;">
			<v-combobox outlined dense hide-details v-model="newVarValue" :items="this.myProfile"
				id="new_var_val"
				v-on:keyup.enter = "emitNewVarValue();" 
				v-on:keyup.esc = "showEditVarValue();"></v-combobox>


			<div class = "confirm" >
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							v-bind="attrs"
							v-on="on"
							id="var_button_cancel_edit_value"
							class="confirm_button" icon
							v-on:click = "showEditVarValue();" >
							<v-icon>mdi-pencil-off</v-icon>
						</v-btn>
					</template>
					<span>Cancel</span>
				</v-tooltip>

				<v-tooltip bottom> 
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							v-bind="attrs"
							v-on="on"
							id="var_button_confirm_edit_value"
							class="cancel_button" icon
							v-on:click = "emitNewVarValue();" >
							<v-icon>mdi-check-bold</v-icon>
						</v-btn>
					</template>
					<span>Confirm</span>
				</v-tooltip>
			</div>

		</div>
		
		<!--
		<v-tooltip bottom v-if = "this.showInput && !this.editName">
			<template v-slot:activator="{ on, attrs }">
				<button
					v-bind="attrs"
					v-on="on"
					id="var_button_check"
					class="sidebar_button"
					v-on:click="emitText">
					<v-icon>mdi-check-bold</v-icon>
				</button>
			</template>
			<span>Done</span>
		</v-tooltip> -->

	</div>
</template>

<script>
import firebase from 'firebase'
import firebaseMixin from '@/mixins/firebaseMixin'

export default {
	name: "var-editor",

	props: {
		varName: String,
		initVarVal: String,
		varColor: String,
	},

	data() {
		return {
			newVarValue: this.initVarVal,
			prevVarValue: this.initVarVal,
			newVarName: this.varName.replace("$", ""),
			prevVarName: this.varName.replace("$", ""),

			editName: false,
			editVar: false,
			delete: false,

			userID: '',
			myProfile: [],
			myVarNames: [],
		};
	},

	computed: {
		editVariableValue: function() {
            var source = this.newVarValue;

            source = source.replace(/&quot;/g, '"');
            source = source.replace(/&#39;/g, "'");
            source = source.replace(/&lt;/g, "<");
			source = source.replace(/&gt;/g, ">");
			
            return source;
        },

        emitVariableValue: function() {
            var source = this.newVarValue;

            source = source.replace(/"/g, "&quot;");
            source = source.replace(/'/g, "&#39;");
            source = source.replace(/</g, "&lt;");
            source = source.replace(/>/g, "&gt;");
            
            return source.trim();
		},

		editVariableName: function(){
			var source = this.newVarName;

			source = source.replace('$', '');

			return source.trim();
		},

		emitVariableName: function(){
			var source = this.newVarName;

			if(!source.includes('$'))
				source = '$' + source;

			return source.trim();
		}
		
		
	},

	methods: {
		showEditVarName: function(){
			this.delete = false;

			this.editName = !this.editName;

			if(!this.editName){
				this.newVarName = this.prevVarName;
			}
		},

		emitNewVarName: function(){
			var x = document.getElementById("new_var_name");
			this.newVarName = x.value;
			this.$emit("evtNewVarName", {prevName: "$" + this.prevVarName, newName: this.emitVariableName});
			console.log(JSON.stringify({prevName: "$" + this.prevVarName, newName: this.emitVariableName}));

			this.prevVarName = this.newVarName;
			this.editName = !this.editName;

			var i;
            for (i=0; i<this.myVarNames.length; i++) {
                if (this.newVarName === this.myVarNames[i]) {
					this.newVarValue = this.myProfile[i];
                    this.prevVarValue = this.newVarValue;
					var toEmit = { name: this.emitVariableName, value: this.emitVariableValue };
					this.$emit("evtGetNextValue", toEmit);
					console.log(JSON.stringify(toEmit));
                    return;
                }
            }

		},

		showEditVarValue: function(){
			this.delete = false;

			this.editVar = !this.editVar;

			if(!this.editVar){
				this.newVarValue = this.prevVarValue;
			}
		},

		emitNewVarValue: function() {
			var y = document.getElementById("new_var_val");
			this.newVarValue = y.value;
			this.prevVarValue = this.newVarValue;

			var toEmit = { name: this.emitVariableName, value: this.emitVariableValue };
			this.$emit("evtGetNextValue", toEmit);
			console.log(JSON.stringify(toEmit));

			this.editVar = !this.editVar;
		},

		showDelete: function(){
			this.delete = !this.delete;
		},

		emitDelete: function(){
			this.$emit("evtDelete", {name: this.varName});
		}
	},

	created() {
		this.userID = firebase.auth().currentUser.uid;
		this.myProfile = this.getVarVals(this.userID);
		this.myVarNames = this.getVarNames(this.userID);
	},
	mixins: [firebaseMixin]
};
</script>

<style scoped>
	#var_editor {
		vertical-align: middle;
	}


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

	.confirm{
		display:grid;
		grid-template-areas: 
			"conf canc";
		grid-template-columns: 1fr 1fr;
		padding-left: 2px;
		padding-right: 2px;
	}

	.confirm_button{
		grid-area: conf;
	}

	.cancel_button{
		grid-area:canc;
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