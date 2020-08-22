<template>
	<div id="page_layout">
		<div id = "header">
			<button v-if = "!this.editName" v-on:click = "showEditName" style = "cursor: pointer;">
				<h2 v-if = "!this.editName" :style = "this.starting ? 'color: green' : ''" id = "name">{{this.passageName}}</h2>
			</button>

			<input id = "passageName" v-if = "this.editName" v-model = "this.passageName" v-on:blur = "updatePassageName"/>

			<div id = "options" v-if = "this.editName" style = "border-top: solid 2px lightgray; padding-top: 7px;">
				<div id = "passageOptions" v-if = "!this.delete" style = "display:flex; flex-direction:row; justify-content: space-between;">
					<v-btn id = "startPassage" class = "sameWidth" v-on:click = "emitStartPassage(); showEditName();">Set As Start Passage</v-btn>
					<v-btn id = "cancel" class = "sameWidth" v-on:click = "showEditName"><v-icon>mdi-close</v-icon> Cancel</v-btn>
					<v-btn id = "submit" class = "sameWidth"  v-on:click = "updatePassageName"><v-icon>mdi-check</v-icon> Submit</v-btn>
					<v-btn id = "deletePassage" class = "sameWidth" v-on:click = "showDelete"><v-icon>mdi-delete</v-icon> Delete Passage</v-btn>
				</div>

				<div id = "deleteOptions" v-if = "this.delete && this.editName" style = "display:flex; flex-direction:row; justify-content:space-around;">
					<v-btn id = "cancel" class = "sameWidth" v-on:click = "showDelete"><v-icon>mdi-close</v-icon> Cancel</v-btn>
					<v-btn id = "submit" class = "sameWidth" v-on:click = "emitDelete"><v-icon>mdi-check</v-icon> Delete</v-btn>
				</div>
			</div>
		</div>

		<div id = "story_field">
			<audio-list v-if = "this.hasAudioFiles" :audioList = "this.audioFiles" v-on:removeMediaFromPage = "removeAudioFromPage"/>

			<text-editor v-bind:dispText = "this.dispPassage.text" v-bind:linkText = "this.linkPassage.text" 
					id = "text_field" 
					v-on:evtPassageChange = "emitNewPassage" 
					v-bind:key = "renderKey" 
					v-bind:theme = "this.pageTheme"
					v-bind:style = "this.themeView ? this.pageTheme : ''"/>

			<div id = "image_field" v-if = "this.hasImages">
				<image-list v-for = "(imageData, i) in this.imageFiles" v-bind:key = "i" 
							v-bind:imageData = "imageData" 
							style = "float:left;"
							v-on:removeMediaFromPage = "removeImageFromPage">
				</image-list>
			</div>
		</div>

		<v-tooltip bottom>
			<template v-slot:activator="{ on, attrs }">
				<button v-bind="attrs" v-on="on" 
					id="prevButton" class="layoutbutton"
					v-on:click="prevPage">
					<v-icon>mdi-arrow-left</v-icon>
				</button>
			</template>
			<span>Back to Previous Page</span>
		</v-tooltip>

		<div id = "linkButtons">
			<v-btn :disabled = "this.atStart" style = "margin: 10px;" v-on:click = "emitStartingPage"><v-icon>mdi-home</v-icon>Go To Start</v-btn>	

			<v-btn v-for = "(linkData, i) in page.links" style = "margin: 10px;" v-bind:key = "i" v-on:click = "emitPage(linkData)">{{linkData.name}}<v-icon>mdi-arrow-right</v-icon></v-btn>
		</div>
	</div>
</template>

<script>
import Page from "@/js/extwee_utils/Page.js"
import Text_Editor from "./text/Text_Editor.vue"

import Audio_List from "./tools/media/Audio_List.vue"
import Image_List from "./tools/media/Image_List.vue"

export default {
	name: "page-layout",

	components: {
		'text-editor': Text_Editor,
		'audio-list': Audio_List,
		'image-list': Image_List,
	},

	props: {
		page: Page,
		themeView: Boolean,

		imageVars: Map,
		audioVars: Map,
	},

	data(){
		return{
			dispPassage: this.page.dispPassage,
			linkPassage: this.page.linkPassage,
			pageNum: this.page.pageNumber,
			pageTheme: this.page.theme,
			passageName: this.page.dispPassage.name,

			editName: false,
			atStart: true,
			delete: false,
			renderKey: 0 
		}
	},

	computed:{
		starting: function() {
			return this.page.linkPassage.tags.includes("start");
		},

		hasAudioFiles: function() {
			return this.audioFiles.length != 0;
		},

		hasImages: function() {
			return this.imageFiles.length != 0;
		},

		audioFiles: function(){
			var ret = [];

			for(var i = 0; i < this.page.audioFiles.length; i++){
				ret.push({name: this.page.audioFiles[i].name, data: this.audioVars.get(this.page.audioFiles[i].name)});
			}

			//console.log("Audio Files: " + JSON.stringify(ret));

			return ret;
		},

		imageFiles: function(){
			var ret = [];

			for(var i = 0; i < this.page.imageFiles.length; i++){
				ret.push({name: this.page.imageFiles[i].name, data: this.imageVars.get(this.page.imageFiles[i].name)});
			}

			//console.log("Image Files: " + JSON.stringify(ret));

			return ret;
		}
	},

	methods:{
		emitPage: function(linkData) {
			this.$emit("evtNext", linkData);
			this.renderKey++;
		},

		prevPage: function() {
			this.$emit("evtPrev");
			this.renderKey--;
		},

		updatePassageName: function() {
			this.passageName = document.getElementById("passageName").value;
			var oldName = this.page.linkPassage.name;

			this.$emit("evtPassageNameChange", {newName: this.passageName, prevName: oldName});
		},

		emitNewPassage(event) {
			var variablesPassage = this.linkPassage.tags.includes("variables");
			this.page.linkPassage.text = event; 

			this.$emit("evtPassageChange", {name: this.linkPassage.name, text: event, isVariables: variablesPassage});
		},

		emitStartingPage() {
			this.$emit("evtStart");
		},

		showEditName: function() {
			this.editName = !this.editName;
		},

		showDelete: function() {
			this.delete = !this.delete;	
		},

		emitDelete: function() {
			this.$emit("evtDelete", {name: this.linkPassage.name});
		},

		emitStartPassage: function() {
			this.$emit("evtStartPage", {name: this.linkPassage.name});
		},

		removeImageFromPage: function(mediaObj) {
			this.$emit("removeImageFromPage", mediaObj);
		},

		removeAudioFromPage: function(mediaObj){
			this.$emit("removeAudioFromPage", mediaObj)
		}
	},

	created: function() {
		if(this.linkPassage.tags.includes("start")){
			this.atStart = true;
		} else {
			this.atStart = false;
		}
	},

	mounted: function() {
		this.$nextTick(function() {
			this.$emit("evtMinHeight", document.getElementById("page_layout").offsetHeight);
		});
	}
};
</script>

<style scoped>
	#page_layout {
		display: grid;
		grid-template-areas: 
			"header header header header header"	
			"prev text text text next";
		grid-template-columns: 1fr 4fr 4fr 4fr 1fr;

		padding: 5px;
	}

	#story_field {
		grid-area: text;
		
		display: flex;
		flex-direction:column;	

		padding: 5px;

		border: solid lightgray;
		border-radius: 5px;
		border-width: 4px;
	}

	#audio_field {
		padding-bottom: 0px;
		float: left;
	}

	#text_field {
		display: block;
		float: left;
	}

	#image_field {
		margin: 10px;
		float: left;
	}

	#header {
		grid-area: header;
		display: flex;
		flex-direction: column;
		text-align:center;
		justify-content: space-around;
		
		padding: 10px;
		border: solid lightgray;
		border-radius: 5px;
		border-width: 4px;
	}

	#passageName {
		border: solid lightgray;
		border-radius: 5px;
		border-width: 2px;

		text-align: center;

		font-size: 25px;
		font-weight: bold;
	}

	#edit_header {
		grid-area:label1;

		display: flex;
		flex-direction: column;
		justify-content: space-around;

		padding: 10px;
	}

	#linkLabel {
		grid-area:label2;
	}

	#linkButtons {
		grid-area: next;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		border: solid lightgray;
		border-radius: 5px;
		border-width: 4px;
	}


	#prevButton {
		grid-area: prev;
		padding: 5px;

		border: solid lightgray;
		border-radius: 5px;
		border-width: 4px;

		outline: none;
	}

	#downloadTButton {
		grid-area: downloadT;
		font-size: 20px;
	}

	#downloadHButton {
		grid-area: downloadH;
		font-size: 20px;
	}

	#viewHButton {
		grid-area: viewH;
		font-size: 20px;
	}

	@keyframes border_anim {
		from{border:solid gray;}
		to{border:solid black;}
	}

	.layoutButton {
		border: solid white;
        border-width: 5px;
		border-radius: 5px;
		padding: 2px;
	}

	.layoutButton:hover {	        
		animation: border_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}

	#editable_field {
		grid-area: text;
		align-content: center;
		padding-left: 25px;
		padding-right: 25px;
	}

	#divider {
		grid-area: divider;
		width: auto;
		display: grid;

		border:solid lightgray;
		border-width: 2px;
		border-radius: 5px;

		grid-template-areas: 
                "passageName inputName inputName inputName inputName inputName"
                "done done done cancel cancel cancel";
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
		column-gap: 20px;
	}

	#new_name {
		grid-area:passageName;
		text-align: right;
	}

	#new_name_val {
		grid-area:inputName
	}

	#confirm_new_passage {
		grid-area:done;
	}

	#cancel_new_passage {
		grid-area: cancel;
	}

	.sameWidth {
		width:24%;
	}

	.input {
		padding: 3px;
		border: solid lightgray;
		border-radius: 5px;
		border-width: 2px;
	}

	span {
		overflow: auto;
	}

	button {
		outline: none;
	}

	.spacing {
        height: 10px;
    }
</style>