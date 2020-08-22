<template>
    <div id = "color_picker">
        <div id = "header">
            <label id = "purpose">{{this.purpose}}</label>
            <button id = "chosen_color" v-bind:style= "'background-color: ' + this.color + ';'" class = "sidebar_button" v-on:click = "showCanvas"></button>
        </div>

        <div id = "color_picker_flex" v-if = "this.canvasVisible">
            <div id = "rgb_select">
                <v-color-picker hide-mode-switch :key = "this.canvasRenderKey" :width = "this.canvasWidth" :hide-canvas = "!this.canvasVisible" :disabled = "!this.canvasVisible" id="color_input" v-model= "color" v-on:update:color = "showColorChange"/>
            </div>
            
            <div id = "submit">
                <!-- <button v-if = "this.colorChanged" class = "sidebar_button" v-on:click = "emitColor"><v-icon>mdi-check</v-icon></button> -->

                <v-tooltip bottom v-if = "this.colorChanged">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            icon v-on:click = "emitColor">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </template>
                    <span>Apply Changes</span>
                </v-tooltip>

                <!-- <button v-if = "this.colorChanged" class = "sidebar_button" v-on:click = "hideColorChange"><v-icon>mdi-close</v-icon></button> -->

                <v-tooltip bottom v-if = "this.colorChanged">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            icon v-on:click = "hideColorChange">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                    <span>Cancel Changes</span>
                </v-tooltip>

            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: "color-picker",

    props:{
        purpose: String,
        initColor: String
    },

    data(){
        return{
            color: this.initColor,
            prevColor: "#FFFFFF",
            colorChanged: false,
            canvasVisible: false,

            canvasWidth: 300,
            canvasRenderKey: 0
        }
    },

    methods:{
        emitColor: function(){
            if(this.colorChanged){
                this.prevColor = this.color;
                this.$emit("evtColorChange", this.color);
                this.colorChanged = false;  
                this.canvasVisible = false;
            } else {
                this.canvasVisible = false;
            }
        },

        showColorChange: function(){
            this.colorChanged = true;
        },

        hideColorChange: function(){
            this.colorChanged = false;    
            this.color = this.prevColor;
        },

        showCanvas: function(){
            this.checkCanvasWidth();    
            this.canvasVisible = !this.canvasVisible;
            //document.getElementById("chosen_color").style.backgroundColor = this.color;
        },

        checkRenderHints:function(){
            if(this.canvasRenderKey > 10){
                this.canvasRenderKey = 0;
            }
        },

        checkCanvasWidth: function(){
            this.canvasWidth = ((document.getElementById("header").offsetWidth / 5) * 4) - 40;
            this.canvasRenderKey++;
            this.checkRenderHints();
        }
    },

    created() {
        window.addEventListener("resize", this.checkCanvasWidth);
    },

    destroyed() {
        window.removeEventListener("resize", this.checkCanvasWidth);
    },
}
</script>

<style scoped>

#color_picker{
    
    text-align: center;
    border: solid lightgray;
    border-radius: 5px;
    border-width: 2px;
    
    padding: 10px;
}

#header{
    display: grid;
    grid-template-areas: 
        "purpose view";
    grid-template-columns: 3fr 2fr;
    column-gap: 10px;

    padding: 5px;
}

#purpose{
    grid-area: purpose;
}

#edit{
    grid-area: button;
}

#color_picker_flex{
    display: grid;
    grid-template-areas: 
        "picker accept";
    grid-template-columns: 9fr 1fr;

    padding: 5px;

    border: solid lightgray;
    border-radius: 5px;
    border-width: 1px;
}

#rgb_select{
    grid-area: picker;
    height: auto;
}

#submit{
    grid-area: accept;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    text-align: center;

    height: 150px;

}

#chosen_color{
    grid-area: view;

    border: solid lightgray;
    border-radius: 5px;
    border-width: 1px;
}

button{
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