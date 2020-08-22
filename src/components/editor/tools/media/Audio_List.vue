<template>
    <div class = "container">
        <div id = "tabbed_list" v-bind:key = "this.audioRenderKey" style = "display:flex; flex-direction: row; justify-content: start;">
            <page-element v-for = "(audio, index) in this.audioList" v-bind:key = "index" class = "audio_elem" 
                            :style = "audioData != null && audio.name == audioData.name ? 'border: solid 2px gray; background: whitesmoke;' : 'border: solid 2px lightgray;'"
                            :select = "true" 
                            :showSelect = "false" 
                            :name = "audio.name"
                            :fileName = "audio.data.fileName"
                            :audioData = "audio"
                            v-on:evtAdd = "selectMedia"
                            v-on:evtDelete = "deleteMedia" /> 
        </div>
    </div>
</template>

<script>
import Page_Element from './Page_Element.vue'

export default {
    name:'audio-item',

    components:{
        'page-element': Page_Element,
    },

    props: {
        audioList: Array,
    },

    data() {
        return {
            audioData: null,
            audioRenderKey: 0,

            volumeControls: false,
            show: false,
            
            playing: false,
        }
    },

    computed: {
        getSrc: function() {
            return this.audioData.data.path.i;
        },

        name: function() {
            return this.audioData.name;
        }
    },

    methods: {
        selectMedia: function(event) {
            for(var i = 0; i < this.audioList.length; i++){
                if(event.name == this.audioList[i].name && 
                    (this.audioData != null && this.audioData.name != event.name || this.audioData == null)){
                   
                    this.audioData = this.audioList[i];
                    
                    return;
                }
            }

            // this.audioData = null;
        },

        deleteMedia: function(event) {
            var delData = null;

            for(var i = 0; i < this.audioList.length; i++){
                if(event.fileName == this.audioList[i].fileName){
                    delData = this.audioList[i];
                }
            }

            this.$emit("removeMediaFromPage", delData);
        },

        /* showVolumeControls: function(){
            this.volumeControls = !this.volumeControls;
        },

        playPause: function(){
            this.playing = !this.playing;

            if(this.playing){
                this.$refs.player.play();
            } else {
                this.$refs.player.pause();
            }
        } */
    }
}

</script>

<style scoped>

    .audio_elem{
        border-radius: 5px;
    }

    @keyframes border_anim {
        from{border: solid white;}
        to{border:solid #F05E23;}
	}

    .sidebar_button {
		border: solid white;
        border-width: 3px;
		border-radius: 5px;
        padding: 2px;
        height: 100%;
	}

	.sidebar_button:hover {
        border-width: 2px;
        border-radius: 5px;
        padding: 2px;
		animation: border_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}

</style>