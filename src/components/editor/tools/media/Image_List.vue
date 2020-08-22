<template>
    <div class = "container">
        <img v-if = "this.displayable" class = "image" :src = "this.src"/>
        <div class = "image" v-else>
            <p>No File Uploaded</p>
        </div>

        <label :style = "'text-align:center; font-size:80%; color: ' + this.imageData.data.color + ';'">{{this.name}}: {{this.fileName}}</label><br>
        <v-btn icon v-on:click = "removeMediaFromPage">
            <v-icon>mdi-delete</v-icon>
        </v-btn>

        <div class = "spacing" />
    </div>
</template>

<script>

export default {
    name:'image-item',

    created: function() {
        // console.log(this.imageData);
    },

    props: {
        imageData: Object,
    },

    data() {
        return {
            
        }
    },

    computed: {
        src: function() {
            return this.imageData.data.path.i;
        },

        name: function() {
            return this.imageData.name.replace("@", "");
        },

        displayable: function(){
            return this.imageData.data.path.i != "" || this.imageData.data.file != null;
        },

        fileName: function(){

            if(this.imageData.data.fileName.length > 12){
                return this.imageData.data.fileName.substr(0, 12) + "...";
            } else {
                return this.imageData.data.fileName;
            }

        }
    },

    methods: {
        removeMediaFromPage: function() {
            this.$emit("removeMediaFromPage", this.imageData);
        }
    }
}

</script>

<style scoped>
    .container {
        height: 200px;
        width: auto;

        text-align:center;
    }

    .image {
        width: auto;
        height: 70%;

        border: solid lightgray;
        border-radius: 5px;
        border-width: 1.5px;

        display: block;
        text-align: center;
    }

    @keyframes border_anim {
        from{border: solid white;}
        to{border:solid #F05E23;}
	}

    .button {
		border: solid white;
        border-width: 3px;
		border-radius: 5px;
        padding: 2px;
	}

	.button:hover {
        border-width: 2px;
        border-radius: 5px;
        padding: 2px;
		animation: border_anim;
		animation-fill-mode: forwards;
		animation-duration: 500ms;
	}

    .spacing {
        height: 20px;
    }
</style>