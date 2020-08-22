<template>
    <div id = "list_elem" :style = "this.selected && this.showSelect ? 'border-radius: 5px; border: solid #F05E23; border-width: 1px' : ''">
        <label id = "list_elem">{{this.name.replace("@", "")}}: {{this.displayFileName}}</label>

        <v-tooltip bottom>
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-bind="attrs" v-on="on"
					id = "list_delete" icon
					v-on:click = "emitDelete">
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</template>
			<span>Remove From Page</span>
		</v-tooltip>

        <div v-bind:key = "this.audioRenderKey + 1">
            <audio ref = "player" style =  "outline: none;">
                <source :src = "getSrc">
                Your browser does not support the audio element.
            </audio>

            <div id = "audio_controls" style = "display: flex; flex-direction: row; justify-content: space-around;"> 
                <v-btn icon v-on:click = "playPause"><v-icon>{{this.playing ? 'mdi-pause' : 'mdi-play'}}</v-icon></v-btn>                 
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'list-element',
    
    props: {
        name: String,
        fileName: String,
        select: Boolean,
        showSelect: Boolean,
        audioData: Object,
    },

    data() {
        return {
            deleteOptions: false,
            selected: false,

            audioRenderKey: 0,
            playing: false,
        }
    },

    computed:{
        getSrc: function() {
            return this.audioData.data.path.i;
        },

        displayFileName: function(){
            if(this.fileName.length > 14){
                return this.fileName.substr(0, 14) + "...";
            } else {
                return this.fileName;
            }
        }
    },

    methods:{
        /* emitAdd: function() {
            this.selected = !this.selected;
            this.$emit("evtAdd", {name: this.name, selected: this.selected});
        }, */

        emitDelete: function() {
            this.$emit("evtDelete", {name: this.name});
        },

        playPause: function(){
            this.playing = !this.playing;

            if(this.playing){
                this.$refs.player.play();
            } else {
                this.$refs.player.pause();
            }
        }
    }
}
</script>

<style scoped>
    #list_elem{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding: 3px;
    }

    button{
        outline: none;
    }

    #list_elem{
        padding-top: 0.4rem;
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
</style>