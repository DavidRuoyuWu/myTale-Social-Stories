<template>
    <div id = "media_sidebar">
        <div id = "header" style = "display:grid; grid-template-columns: 10fr 1fr; text-align:center;">
            <h3 style = "padding-top: 5px;">Media Variables</h3>
            <v-btn icon id = "hide" v-on:click = "emitDispVars"><v-icon>{{this.hidden ? 'mdi-eye':'mdi-eye-off'}}</v-icon></v-btn>
        </div><br>

        <div v-if = "this.status != ''"><p>{{this.status}}</p></div>
        
        <div id = "spacer">
            <upload-list class = "list" purpose = "Images" :varMap = "this.imageVars"
                        v-on:evtReplaceFile = "replaceImage"
                        v-on:evtNewMediaVariables = "emitNewImageVariable" 
                        v-on:evtNewVarName = "emitImageVarNameChange"
                        v-on:evtAdd = "emitAddImageToPage"
                        v-on:evtDelete = "emitRemoveImage"></upload-list><br> 

            <upload-list class = "list" purpose = "Audio" :varMap = "this.audioVars"
                        v-on:evtReplaceFile = "replaceAudio" 
                        v-on:evtNewMediaVariables = "emitNewAudioVariable" 
                        v-on:evtNewVarName = "emitAudioVarNameChange"
                        v-on:evtAdd = "emitAddAudioToPage"
                        v-on:evtDelete = "emitRemoveAudio"></upload-list> 
        </div>
    </div>
</template>

<script>
import Upload_List from './Upload_List.vue'

export default {
    name: 'media-sidebar',

    components: {
        'upload-list': Upload_List,
    },

    props: {
        status: String,
        imageVars: Map,
        audioVars: Map
    },

    data() {
        return {
            hidden: true,
        }
    },

    created: function() {
    },

    methods: {
        // event: {files, names}
        processImages: function(event) {
            var files = event.files;
            var data = event.data;

            for(var i = 0; i < files.length; i++) {
                var f = files[i];

                var blob = new Blob([f], { type: f.type});
                var src = URL.createObjectURL(blob);
                var t = 'image';
                
                var mediaName = '';
                for(var j = 0; j < data.length; j++) {
                    if(data[j].fileName == f.name) {
                        mediaName = data[j].varName;
                    }
                }
                
                // file: File object
                // fileName: name of file
                // varName: variable name associated with file
                // path: file url
                // type: 'image'
                // id: unique id generated before adding media to page
                this.allImages.push({file: f, fileName: f.name, varName: mediaName, path: src, type: t, id: "", storeStatus: "new"});
            }

            this.allImages = this.allImages.filter(function(img) {
                if(img.path != null) {
                    return img;
                }
            });

            this.$emit("evtImageUpdate", this.allImages);
        },

        // event: {files, data}
        processAudio: function(event) {
            var files = event.files;
            var data = event.data;

            this.allAudio = [];

            for(var i = 0; i < files.length; i++) {
                var f = files[i];

                var blob = new Blob([f], { type: f.type});
                var src = URL.createObjectURL(blob);
                var t = 'audio';
                
                var mediaName = '';
                for(var j = 0; j < data.length; j++) {
                    if(data[j].fileName == f.name) {
                        mediaName = data[j].varName;
                    }
                }
                
                // fileName: name of file
                // varName: variable name associated with file
                // path: file url
                // type: 'audio'
                // id: unique id generated before adding media to page
                this.allAudio.push({file: f, fileName: f.name, varName: mediaName, path: src, type: t, id: ""});
            }
            this.$emit("evtAudioUpdate", this.allAudio);
        },

        // event: {prevName, newName}
        emitAudioVarNameChange: function(event){
            this.$emit("evtAudioNameChange", event);
        },

        // event: {prevName, newName}
        emitImageVarNameChange: function(event){
            this.$emit("evtImageNameChange", event);
        },

        // event: varArr = {name, file, fileName, path, color, id}
        emitNewImageVariable: function(event){
            this.$emit("evtNewImageVariable", event);
        },

        // event: varArr = {name, file, fileName, path, color, id}
        emitNewAudioVariable: function(event){
            this.$emit("evtNewAudioVariable", event);
        },

        // event: {name, data: {file, fileName, path}}
        replaceImage(event){
            this.$emit("evtReplaceImage", event);
        },

        // event: {name, data: {file, fileName, path}}
        replaceAudio(event){
            this.$emit("evtReplaceAudio", event);
        },

        // event: {name, fileName}
        emitAddImageToPage: function(event) {
            this.$emit("evtAddImage", event);
        },

        // event: {name, fileName}
        emitAddAudioToPage: function(event) {
            this.$emit("evtAddAudio", event);
        },

        // event: {name, fileName}
        emitRemoveImage: function(event) {
            this.$emit("evtRemoveImage", event);

            /* if(event.type == "image") {
                this.allImages = this.allImages.filter(function(imageData) {
                    if(imageData.fileName != event.fileName) {
                        return imageData;
                    }
                });
            }
            if(event.type == "audio") {
                this.allAudio = this.allAudio.filter(function(audioData) {
                    if(audioData.fileName != event.fileName) {
                        return audioData;
                    }
                });
            } */
            //this.allMedia = [];
            //this.allMedia = this.allImages.concat(this.allAudio);
        },

        emitDispVars: function() {
            this.hidden = !this.hidden;
            this.$emit("evtDispVars", {disp: this.hidden});
        },

        // event: {name, fileName}
        emitRemoveAudio: function(event){
            this.$emit("evtRemoveAudio", event);
        }
    }
}
</script>

<style scoped>
#media_sidebar {
    text-align: center;
    padding: 5px;
}

input[type="file"] {
    display: none;
}

#spacer {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.list {
    padding: 10px;
}
</style>