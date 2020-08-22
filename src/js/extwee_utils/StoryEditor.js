const Passage = require("./Passage");
const Page = require("./Page");
const Story = require("./Story");

const VAR_TAG = 'variables';

/*const SWATCHES = ["#33658A" , "#86BBD8", "#2F4858", "#F6AE2D", "#F26419", "#8AAA79", "#FA8334", "#FFFD77",
                    "#FFE882", "#388697", "#271033", "#50514F", "#F79256", "#FBD1A2", "#7DCFB6", "#00B2CA",
                    "#1D4E89", "#7E78D2", "#E71D36", "#AF4319", "#772014", "#3F220F", "#19180A", "#C0F8D1"];*/

var NUM_VARS = 0;
var NUM_IMG_VARS = 0;
var NUM_AUD_VARS = 0;

/**
 * @class StoryEditor
 * @module StoryEditor
 */
class StoryEditor {
    /**
     * @function StoryEditor
     * @param {Story} story - The story to generate
     * @class StoryEditor
     */
    constructor(story) {

        this.baseStory = story;
        this.exportedStoryPages = [];

        this.variables = new Map();
        this.imageVariables = new Map();
        this.audioVariables = new Map();

        this.css = "";
        this.js = "";
        
        this.regeneratePages();

        this.parseVariables();
        this.generateStoryText(true);

        this.reparseMedia();
    }

    /** 
     * Get the default value of a text variable
     * 
     * @function extractDefault
     * @param {string} line - Line to extract from
     * @returns {String}
     */
    extractDefault(line) {

        var pos1 = line.indexOf(";");
        var pos2 = line.lastIndexOf("&");

        return line.slice(pos1 + 1, pos2);

    }

    /**
     * Changes the value of the variable
     * 
     * @param {String} line - Line to splice into
     * @param {String} newVal - Value to splice
     * @returns {String}
     */
    writeVariable(line, newVal) {
        var pos1 = line.indexOf(";");
        var pos2 = line.lastIndexOf("&");

        return line.slice(0, pos1 + 1) + newVal + line.slice(pos2, line.length);

    }

    /** 
     * Get the default name of a text variable
     * 
     * @function extractVariable
     * @param {String} line - Line to extract from
     * @returns {String}
     */
    extractVariable(line) {
        var pos = line.indexOf("$");

        var variable = "";

        while ((line.charAt(pos)) != " ") {
            variable += line.charAt(pos);
            pos++;
        }

        return variable;
    }

    /** 
     * Obtain all the variables from a story object
     * 
     * @function parseVariables
     * @returns {void}
     */
    parseVariables() {

        //Extract the passage with variable tag,
        //IMPORTANT: VAR_TAG SHOULD NOT BE USED DURING STORY CREATION
        //           THIS PASSAGE WILL BE AUTOMATICALLY GENERATED AND ADDED 
        //           TO THE FIRST PASSAGE OF THE STORY.
        let variablePassage = [];

        if (this.baseStory.passages.length > 0) {
            variablePassage = this.baseStory.passages.filter(function (passage) {
                const results = passage.tags.filter(tag => tag === VAR_TAG);

                return (results.length > 0);
            });
        }

        this.variables.clear();
        //Checks if there is only one passage with the variable tag

        if (variablePassage.length == 1) {
            var variableText = variablePassage[0].text;
            var lines = variableText.split("\n");

            console.log(lines.length);

            for (var j = 0; j < lines.length; j++) {

                if (lines[j].includes("(set:")) {

                    //Adds each variable to a js Map

                    var variable = this.extractVariable(lines[j]);
                    var defVal = this.extractDefault(lines[j]);
                    
                    if(this.variables.has(variable)){
                        alert("Duplicate Variable \n\nUpdating Value to: " + "\"" + defVal + "\"");
                    }


                    this.variables.set(variable, {value: defVal, color: "", id: NUM_VARS++});
                    console.log(variable + " " + defVal);

                } else if(lines[j].includes("(hidden:)")){
                    var varData = this.extractArr(lines[j]); 

                    if(varData.type == "image"){

                        for(var k = 0; k < varData.data.length; k++){
                            var imgSrc = this.extractSrc(varData.data[k]);

                            this.imageVariables.set(varData.data[k].substring(0, varData.data[k].indexOf("{")), {file: null, fileName: imgSrc.name, path: imgSrc.src, color: "", id: NUM_IMG_VARS++, uploaded: !imgSrc.src.i.includes("blob")});
                        }
                    } else if(varData.type == "audio"){

                        for(var a = 0; a < varData.data.length; a++){
                            var audSrc = this.extractSrc(varData.data[a]);

                            this.audioVariables.set(varData.data[a].substring(0, varData.data[a].indexOf("{")), {file: null, fileName: imgSrc.name, path: audSrc.src, color: "", id: NUM_AUD_VARS++, uploaded: !audSrc.src.i.includes("blob")});
                        }

                    }

                }

            }

            lines = lines.filter(function(line) {
                return !line.includes("(set:") && !line.includes("(hidden:)");  
            });
            
            for(var l = 0; l<  this.baseStory.passages.length; l++){
                if(this.baseStory.passages[l].tags.includes(VAR_TAG)){

                    this.baseStory.passages[l].text = lines.join("\n");

                    break;
                }
            }
        } else {
            throw new Error("Please remove extra variable passage tags");
        }

        this.detVariableColors();
        this.printVariableData();
    }

    /**
     * Extracts the image variable data in the story
     * 
     * @function extractArr
     * @param {String} line 
     */
    extractArr(line){
        var source = line.split("[");
        var chunk = source[1].replace("]", "");
        source = chunk.split(":");

        var type = source[0];
        var arr = chunk.replace(source[0] + ":", "").split(",");

        arr = arr.filter(function(i){
            return i != "";
        })

        console.log(arr);

        return {type: type, data: arr};
    }

    extractSrc(line){
        var source = line.split("{");

        var src = "";
        var fileName = "";

        if(source.length > 1){
            src = source[1].split(" ")[0];
            fileName = source[1].split(" ")[1].replace("}", "");
        }

        return {src: {i: src}, name: fileName};
    }

    /**
     * Removes the variable code injection
     * 
     * @function removeVariableInject
     * 
     */
    removeVariableInject(){

        var text = sessionStorage.getItem("preProcessedBaseText");
        var process = text != "";

        if(process){
            for(var k = 0; k< this.baseStory.passages.length; k++){
                if(this.baseStory.passages[k].tags.includes(VAR_TAG)){
                
                    
                    this.baseStory.passages[k].text = text;

                    break;
                }
            }

            for(var i = 0; i< this.exportedStoryPages.length; i++){
                if(this.exportedStoryPages[i].linkPassage.tags.includes(VAR_TAG)){

                    this.exportedStoryPages[i].linkPassage.text = text;
                    break;
                }
            }
        }

        /*let variablePassage = [];

        if (this.baseStory.passages.length > 0) {
            variablePassage = this.baseStory.passages.filter(function (passage) {
                const results = passage.tags.filter(tag => tag === VAR_TAG);

                return (results.length > 0);
            });
        }

        //Checks if there is only one passage with the variable tag

        if (variablePassage.length == 1) {
            var variableText = variablePassage[0].text;
            var lines = variableText.split("\n");

            lines = lines.filter(function(line) {
                return !line.includes("(set:");  
            });
            
            for(var k = 0; k< this.baseStory.passages.length; k++){
                if(this.baseStory.passages[k].tags.includes(VAR_TAG)){
                    this.baseStory.passages[k].text = lines.join("\n");

                    break;
                }
            }
        } else {
            throw new Error("Please remove extra variable passage tags");
        }*/
    }

    detVariableColors(){
        this.detTextVariableColors();
        this.detImageVariableColors();
        this.detAudioVariableColors();
    }

    detImageVariableColors(){
        var sortedKeys = [];

		this.imageVariables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
        );
        
        var varMap = this.imageVariables;

		sortedKeys = sortedKeys.sort(function(a, b){
            var idA = varMap.get(a).id;
            var idB = varMap.get(b).id;

            return idA - idB;
            
        });
        

        for(var i = 0; i < sortedKeys.length; i++){
            var data = this.imageVariables.get(sortedKeys[i]);


            if(data.color == ""){
                var oR = 255;
                var oG = 165;
                var oB = 0;

                var randR = Math.random() * 256
                var randG = Math.random() * 256;
                var randB = Math.random() * 256;

                data.color = "rgb(" + ((oR + randR)/2) + "," + ((oG + randG)/2) + "," + ((oB + randB)/2) + ")";
            }

            this.imageVariables.set(sortedKeys[i], data);
        }
    }

    detAudioVariableColors(){
        var sortedKeys = [];

		this.audioVariables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
        );
        
        var varMap = this.audioVariables;

		sortedKeys = sortedKeys.sort(function(a, b){
            var idA = varMap.get(a).id;
            var idB = varMap.get(b).id;

            return idA - idB;
            
        });
        

        for(var i = 0; i < sortedKeys.length; i++){
            var data = this.audioVariables.get(sortedKeys[i]);


            if(data.color == ""){
                var oR = 255;
                var oG = 165;
                var oB = 0;

                var randR = Math.random() * 256
                var randG = Math.random() * 256;
                var randB = Math.random() * 256;

                data.color = "rgb(" + ((oR + randR)/2) + "," + ((oG + randG)/2) + "," + ((oB + randB)/2) + ")";
            }



            this.audioVariables.set(sortedKeys[i], data);
        }
    }
    /**
     * Determines the swatch of the variable
     * 
     * @function detVariableColors
     * 
     */
    detTextVariableColors(){
        var sortedKeys = [];

		this.variables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
        );
        
        var varMap = this.variables;

		sortedKeys = sortedKeys.sort(function(a, b){
            var idA = varMap.get(a).id;
            var idB = varMap.get(b).id;

            return idA - idB;
            
        });
        

        for(var i = 0; i < sortedKeys.length; i++){
            var data = this.variables.get(sortedKeys[i]);


            if(data.color == ""){
                var oR = 255;
                var oG = 165;
                var oB = 0;

                var randR = Math.random() * 256
                var randG = Math.random() * 256;
                var randB = Math.random() * 256;

                data.color = "rgb(" + ((oR + randR)/2) + "," + ((oG + randG)/2) + "," + ((oB + randB)/2) + ")";
            }



            this.variables.set(sortedKeys[i], data);
        }
		
    }

    printVariableData(){
        this.imageVariables.forEach(function(data, key){
            console.log(key + "==>" + JSON.stringify(data));
        });

        this.audioVariables.forEach(function(data, key){
            console.log(key + "==>" + JSON.stringify(data));
        });

        this.variables.forEach(function(data, key){
            console.log(key + "==>" + JSON.stringify(data));
        });
    }

    /**
     * Reparses the links in the passage text
     * @function reparseLinks
     */
    reparseLinks(){
        for(var i = 0; i < this.exportedStoryPages.length; i++){
            this.exportedStoryPages[i].reparseLinks();
        }
    }

    /**
     * 
     */
    reparseMedia(){
        for(var i = 0; i < this.exportedStoryPages.length; i++){
            this.exportedStoryPages[i].reparseMedia(this.imageVariables, this.audioVariables);
        }
    }

    /**
     * 
     * @param {*} event 
     */
    addAudioToPage(event){
        for(var i = 0; i < this.exportedStoryPages.length; i++){
            if(this.exportedStoryPages[i].pageName == event.pageName)
                this.exportedStoryPages[i].addAudio(event);
        }
        
        this.reparseMedia();
        //this.printVariableData();
    }

    /**
     * 
     * @param {*} event 
     */
    removeAudioFromPage(event){
        for(var i = 0; i < this.exportedStoryPages.length; i++){
            if(this.exportedStoryPages[i].pageName == event.pageName)
                this.exportedStoryPages[i].removeAudio(event);
        }
        
        this.reparseMedia();
        //this.printVariableData();
    }

    /**
     * 
     * @param {*} event 
     */
    addImageToPage(event){
        for(var i = 0; i < this.exportedStoryPages.length; i++){
            if(this.exportedStoryPages[i].pageName == event.pageName)
                this.exportedStoryPages[i].addImage(event);
        }

        this.reparseMedia();
        //this.printVariableData();
    }

    /**
     * 
     * @param {*} event 
     */
    removeImageFromPage(event){
        for(var i = 0; i < this.exportedStoryPages.length; i++){
            if(this.exportedStoryPages[i].pageName == event.pageName)
                this.exportedStoryPages[i].removeImage(event);
        }

        this.reparseMedia();
        //this.printVariableData();
    }


    /**
     * Refactors the link text so that it is properly configured
     * 
     * @function replaceLinks
     * @param {Event} event 
     */
    replaceLinks(event){
        for(var i = 0; i < this.exportedStoryPages.length; i++){

            this.exportedStoryPages[i].replaceLinks(event);

            for(var j = 0; j < this.baseStory.passages.length; j++){
                if(this.baseStory.passages[j].name == this.exportedStoryPages[i].linkPassage.name){
                    this.baseStory.passages[j].text = this.exportedStoryPages[i].linkPassage.text;
                }
            }
        }
    }

    /**
     * Refactors the link text so that it is properly configured
     * 
     * @function replaceLinks
     * @param {Event} event 
     */
    replaceVariables(event){

        var mergedMap = new Map();

        this.variables.forEach(function(value, key){
            mergedMap.set(key, value);
        });

        this.imageVariables.forEach(function(value, key){
            mergedMap.set(key, value);
        });

        this.audioVariables.forEach(function(value, key){
            mergedMap.set(key, value);
        });

        for(var i = 0; i < this.exportedStoryPages.length; i++){

            this.exportedStoryPages[i].replaceVariable(event, mergedMap);

            for(var j = 0; j < this.baseStory.passages.length; j++){
                if(this.baseStory.passages[j].name == this.exportedStoryPages[i].linkPassage.name){
                    this.baseStory.passages[j].text = this.exportedStoryPages[i].linkPassage.text;
                }
            }
        }

        /*for(var m = 0; m < this.exportedStoryPages.length; m++){

            this.exportedStoryPages[m].replaceVariable(event, this.imageVariables);

            for(var n = 0; n < this.baseStory.passages.length; n++){
                if(this.baseStory.passages[n].name == this.exportedStoryPages[m].linkPassage.name){
                    this.baseStory.passages[n].text = this.exportedStoryPages[m].linkPassage.text;
                }
            }
        }

        for(var k = 0; k < this.exportedStoryPages.length; k++){

            this.exportedStoryPages[k].replaceVariable(event, this.audioVariables);

            for(var l = 0; l < this.baseStory.passages.length; l++){
                if(this.baseStory.passages[l].name == this.exportedStoryPages[k].linkPassage.name){
                    this.baseStory.passages[l].text = this.exportedStoryPages[k].linkPassage.text;
                }
            }
        }*/

        //this.printVariableData();
    }

    /**
     * Programmatically adds a link to a page
     * 
     * @function addLink
     * @param {Event} event - data
     */
    addLink(event){

        for(var i = 0; i < this.exportedStoryPages.length; i++){

            if(this.exportedStoryPages[i].pageName == event.pageName){
                this.exportedStoryPages[i].addLink(event.name);
                break;
            }
            
        }

        this.reparseLinks();
        //this.printVariableData();
    }

    /**
     * Removes a link from a page
     * 
     * @function removeLink
     * @param {Event} event - data
     */
    removeLink(event){
        for(var i = 0; i < this.exportedStoryPages.length; i++){

            if(this.exportedStoryPages[i].pageName == event.name){
                this.exportedStoryPages[i].removeLink(event.removeLink);
                break;
            }
            
        }

        this.reparseLinks();
    }

    /**
     * Sets the start page for the story
     * 
     * @function setStartPage
     * @param {Event} event - data
     */
    setStartPage(event){

        for(var i = 0; i < this.baseStory.passages.length; i++){
            if(this.baseStory.passages[i].tags.includes("start")){
                this.baseStory.passages[i].tags = this.baseStory.passages[i].tags.filter(function(tag){
                    return tag != "start";
                });
            } 

            if(this.baseStory.passages[i].tags.includes(VAR_TAG)){
                this.baseStory.passages[i].tags = this.baseStory.passages[i].tags.filter(function(tag){
                    return tag != VAR_TAG;
                });
            } 

            if(this.baseStory.passages[i].name == event.name){
                this.baseStory.passages[i].tags.push("start");
                this.baseStory.passages[i].tags.push(VAR_TAG);
            }
            
            
            var remText = this.baseStory.passages[i].text;
            var source = remText.split("\n");
            
            source = source.filter(function(line) {
                return !line.includes("(set:");  
            });
            
            this.baseStory.passages[i].text = source.join("\n");
        }

        
    }
    
    /**
     * Adds a new page to the story
     * 
     * @function addPage
     * @param {Event} event 
     */
    addPage(event){
        var pageName = event.name;  
        
        var process = true;

        if(process){
            var baseText = "This is a new passage. Edit it to create your own story!\n[[go back-&gt;" + event.prevLink + "]]";

            var nLinkPassage = new Passage(pageName, ["story"], {position:"500, 500", size:"100,100"}, baseText, this.baseStory.passages.length + 1);
            this.baseStory.passages.push(nLinkPassage);

            this.exportedStoryPages.push(new Page(null, nLinkPassage, "background-color: #ffffff; color: #000000;", this.baseStory.getStoryPassages().length, {story: this.baseStory, pages: this.baseStory.getStoryPassages().length}));

            this.reparseLinks();
            this.reparseMedia();
        }
    }

    /**
     * Resets all the pages in the story
     * 
     * @function regeneratePages
     */
    regeneratePages(){
        this.exportedStoryPages = [];
        var length = this.baseStory.getStoryPassages().length;

        for(var i = 0; i < length; i++){
            this.exportedStoryPages.push(new Page(null, this.baseStory.getStoryPassages()[i], "background-color: #ffffff; color: #000000;", i + 1, {story: this.baseStory, pages: length}));
        }
    }

    /**
     * Safely changes the passage name
     * 
     * @function changePassageName
     * @param {Event} event 
     */
    changePassageName(event){
            
        if(event.prevName != event.newName){
            for(var i = 0; i < this.baseStory.passages.length; i++){
                if(this.baseStory.passages[i].name == event.prevName){
                    this.baseStory.passages[i].name = event.newName;
                    console.log("Changed Name");
                }
            }

            for(var j = 0; j < this.exportedStoryPages.length; j++){
                if(this.exportedStoryPages[j].linkPassage.name == event.prevName){
                    this.exportedStoryPages[j].linkPassage.name = event.newName;
                    console.log("Changed Name");
                }
            }

            this.replaceLinks(event);
            this.reparseLinks();
        }
    }

    /**
     * Removes a passage from the story;
     * @function deletePassage
     * @param {Event} event 
     */
    deletePassage(event){

        var passage;
        var index = 0;

        for(var i = 0; i< this.baseStory.passages.length; i++){
            if(this.baseStory.passages[i].name == event.name){
                passage = this.baseStory.passages[i];
                index = i;

                console.log("Passage:" + passage.name);

                break;
            }
        }

        if(passage.tags.includes(VAR_TAG)){
            alert("DELETING THIS PASSAGE WILL RESULT IN STORY BREAKAGE\nABORTING DELETE");
        } else {
            
            if(passage.tags.includes('start')){
                alert("Deleting this passage will randomly assign a new start passage, select a start passage from the passages menu");
                this.baseStory.passages[index + 1].tags.push("start");
            }
            
            this.baseStory.passages = this.baseStory.passages.filter(function(passage){
                return passage.name != event.name;
            });

            this.exportedStoryPages = this.exportedStoryPages.filter(function(page){
                return page.pageName != event.name;
            });

            this.replaceLinks({prevName: event.name, newName: ""});
            this.reparseLinks();
        }

    }

    /** 
     * Change the generated value of a text variable
     * 
     * @function setTextVariable
     * @param {String} variableName - Variable Name to change
     * @param {String} newText - Text to change the variable to
     * @returns {void}
     */
    setTextVariable(variableName, newText) {
        var data = this.variables.get(variableName);
        
        console.log(JSON.stringify(data));

        data.value = newText;

        this.variables.set(variableName, data);
    }


    /** 
     * Change the generated value of a text variable
     * 
     * @function setTextVariable
     * @param {String} variableName 
     * @param {Event} data {}
     * @returns {void}
     */
    setImageVariable(variableName, data){
        this.imageVariables.set(variableName, data);

        this.reparseMedia();
        //this.printVariableData();
    }

    /** 
     * Change the generated value of a text variable
     * 
     * @function setTextVariable
     * @param {String} variableName 
     * @param {Event} data {}
     * @returns {void}
     */
    setAudioVariable(variableName, data){
        this.audioVariables.set(variableName, data);

        this.reparseMedia();
        //this.printVariableData();
    }

    /**
     * 
     * @function changeVariableName
     * @param {Event} event 
     */
    changeTextVariableName(event){
        var process = this.checkEvent({name: event.newName}, "text");

        if(process){
            this.replaceVariables(event);

            var data = this.variables.get(event.prevName);
            this.variables.delete(event.prevName);
            this.variables.set(event.newName, data);
        }

        return process;

    }

    /**
     * 
     * @function changeVariableName
     * @param {Event} event 
     */
    changeImageVariableName(event){
        var process = this.checkEvent({name: event.newName}, "media");

        console.log()

        if(process){
            this.replaceVariables(event);

            var data = this.imageVariables.get(event.prevName);
            this.imageVariables.delete(event.prevName);
            this.imageVariables.set(event.newName, data);

            this.reparseMedia();
        }

        return process;
            //this.printVariableData();
    }

    /**
     * 
     * @function changeVariableName
     * @param {Event} event 
     */
    changeAudioVariableName(event){

        var process = this.checkEvent({name: event.newName}, "media");

        if(process){
            this.replaceVariables(event);

            var data = this.audioVariables.get(event.prevName);
            this.audioVariables.delete(event.prevName);
            this.audioVariables.set(event.newName, data);

            this.reparseMedia();
        }

        return process;
        //this.printVariableData();
    }
    
    /**
     * Adds a variable to the story
     * 
     * @function addVariable
     * @param {Event} event 
     */
    addTextVariable(event){
        
        var process = this.checkEvent(event, "text");

        if(process){
            this.variables.set(event.name, {value: event.value, color: "", id: NUM_VARS++});

            this.detVariableColors();
        }

        return process;
    }

    /**
     * Adds an image variable
     * @function addImageVariable
     * @param {Event} event {name: varName, file: null, fileName: "", path: "", id: ""}
     */
    addImageVariable(event){

        var process = this.checkEvent(event, "media");
        if(process){
            this.imageVariables.set(event.name, {file: event.file, fileName: event.fileName, path: event.path, color: "", id: NUM_IMG_VARS++, uploaded: event.uploaded});
            //this.printVariableData();

            this.detVariableColors();
        }

        return process;
    }

    /**
     * Adds an image variable
     * @function addImageVariable
     * @param {Event} event {name: varName, file: null, fileName: "", path: "", id: ""}
     */
    addAudioVariable(event){
        var process = this.checkEvent(event, "media");
        if(process){
            this.audioVariables.set(event.name, {file: event.file, fileName: event.fileName, path: event.path, color: "", id: NUM_AUD_VARS++, uploaded: event.uploaded});
            //this.printVariableData();

            this.detVariableColors();
        }

        return process;
    }

    checkEvent(event, type){

        var process = false;

        if(type == "text"){
            process = !(this.variables.has(event.name));
        } else if(type == "media"){
            process = !((this.imageVariables.has(event.name)) || (this.audioVariables.has(event.name)));
        }

        if(!process){
            alert(event.name + " already exists!");
        }

        return process;
    }

    /**
     * Removes a variable from the story
     * 
     * @function deleteVariable
     * @param {Event} event 
     */
    deleteTextVariable(event){

        var dataArr = [];

        this.variables.forEach(
            function(value, key){
                dataArr.push({name: key});
            }
        );

        for(var j = 0; j < this.exportedStoryPages.length; j++){
            this.exportedStoryPages[j].removeKeyFromText(dataArr, event.name);
        }
        
        this.variables.delete(event.name);

        var sortedKeys = [];

		this.variables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
		);

		sortedKeys = sortedKeys.sort(function(a, b){
            if(a > b){
                return 1;
            } else if(a < b){
                return -1;
            } else {
                return 0;
            }
            
        });
        

        for(var i = 0; i < sortedKeys.length; i++){
            var data = this.variables.get(sortedKeys[i]);
            data.id--;
            this.variables.set(sortedKeys[i], data);
        }
        

        NUM_VARS--;

    }

    deleteImageVariable(event){

        var dataArr = [];

        this.imageVariables.forEach(
            function(value, key){
                dataArr.push({name: key});
            }
        );

        this.audioVariables.forEach(
            function(value, key){
                dataArr.push({name: key});
            }
        );

        for(var j = 0; j < this.exportedStoryPages.length; j++){
            this.exportedStoryPages[j].removeKeyFromText(dataArr, event.name);
        }
        
        this.imageVariables.delete(event.name);

        var sortedKeys = [];

		this.imageVariables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
		);

		sortedKeys = sortedKeys.sort(function(a, b){
            if(a > b){
                return 1;
            } else if(a < b){
                return -1;
            } else {
                return 0;
            }
            
        });
        

        for(var i = 0; i < sortedKeys.length; i++){
            var data = this.imageVariables.get(sortedKeys[i]);
            data.id--;
            this.imageVariables.set(sortedKeys[i], data);
        }

        NUM_IMG_VARS--;

        this.reparseMedia();
        //this.printVariableData();
    }

    deleteAudioVariable(event){

        var dataArr = [];

        this.imageVariables.forEach(
            function(value, key){
                dataArr.push({name: key});
            }
        );

        this.audioVariables.forEach(
            function(value, key){
                dataArr.push({name: key});
            }
        );

        for(var j = 0; j < this.exportedStoryPages.length; j++){
            this.exportedStoryPages[j].removeKeyFromText(dataArr, event.name);
        }

        this.audioVariables.delete(event.name);

        var sortedKeys = [];

		this.audioVariables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
		);

		sortedKeys = sortedKeys.sort(function(a, b){
            if(a > b){
                return 1;
            } else if(a < b){
                return -1;
            } else {
                return 0;
            }
            
        });
        

        for(var i = 0; i < sortedKeys.length; i++){
            var data = this.audioVariables.get(sortedKeys[i]);
            data.id--;
            this.audioVariables.set(sortedKeys[i], data);
        }

        NUM_AUD_VARS--;


        this.reparseMedia();
        //this.printVariableData();
    }

    /**
     * Get the new text for a passage and replace it in the story
     * 
     * @function setPassage
     * @param {String} passageName - Name of the passage
     * @param {String} newText - New text for the passage
     * @param {String} hidden - Value to regenerate story text
     * @returns {void}
     */
    setPassage(passageName, newText){
        for(var i = 0; i < this.baseStory.passages.length; i++){
            if(this.baseStory.passages[i].name == passageName){
                this.baseStory.passages[i].text = newText;

                console.log("Text Changed");

            }
            
        }

        this.reparseLinks();
        this.reparseMedia();
    }

    /**
     * Changes the name of the story
     * 
     * @function changeStoryName
     * @param {Event} event 
     */
    changeStoryName(event){
        this.baseStory.name = event.name;
    }


    /** 
     * Generate the story with the revised variables.
     * 
     * @function generateViewStory
     * @returns {void}
     */
    generateViewStory(media) {
        //Extract the passage with variable tag,
        //IMPORTANT: VAR_TAG SHOULD NOT BE USED DURING STORY CREATION
        //           THIS PASSAGE WILL BE AUTOMATICALLY GENERATED AND ADDED 
        //           TO THE FIRST PASSAGE OF THE STORY.

        this.css = "";

        console.log("Generating Story...");

        var viewStory = new Story(JSON.parse(JSON.stringify(this.baseStory)));

        console.log(viewStory.name);

        for(var i = 0; i < viewStory.passages.length; i++){
            
            var passageObj = JSON.parse(JSON.stringify(this.exportedStoryPages[i].linkPassage));

            viewStory.passages[i] = new Passage(passageObj.name, passageObj.tags, passageObj.metadata, passageObj.text, passageObj.pid);

            viewStory.passages[i].text = viewStory.passages[i].text.trim();

            if(viewStory.passages[i].tags.includes(VAR_TAG)){
                
                //console.log("Text Changed:" + this.baseStory.passages[i].text);
                var textToPush = viewStory.passages[i].text;
            
                var sortedKeys = [];

                this.variables.forEach(
                    function(value, key){
                        sortedKeys.push(key);
                    }
                );

                sortedKeys = sortedKeys.sort(function(a, b){
                    return a.length - b.length;
                });            

                for(var j = 0; j < sortedKeys.length; j++){
                    
                    //console.log("KEY: " + sortedKeys[j])

                        //console.log("KEY: " + key + " VALUE: " + value)
                    var key = sortedKeys[j];    
                    var temp = textToPush.split(key);
                    var data = this.variables.get(key);
                    
                    textToPush = temp.join(data.value);
                   
                }
                
                
                viewStory.passages[i].text = textToPush +  "\n"  + this.injectVariableText();
            } 

            if(media)
                viewStory.passages[i].text = this.injectMedia(viewStory.passages[i].text);

            this.css += this.exportedStoryPages[i].injectCSSText() + '\n';
        }

        this.css += "body{ text-align: center;}"

        return viewStory;

    }

    injectMedia(textToPush){

        var sortedKeys = [];

        this.imageVariables.forEach(
            function(value, key){
                sortedKeys.push(key);
            }
        );

        this.audioVariables.forEach(
            function(value, key){
                sortedKeys.push(key);
            }
        )

        sortedKeys = sortedKeys.sort(function(a, b){
            return b.length - a.length;
        });            

        for(var j = 0; j < sortedKeys.length; j++){
            
            //console.log("KEY: " + sortedKeys[j])

                //console.log("KEY: " + key + " VALUE: " + value)
            var key = sortedKeys[j];    
            var temp = textToPush.split(key);
            
            var data = null;

            if(this.imageVariables.has(key)){
                data = this.imageVariables.get(key);
                
                textToPush = temp.join("<img style = 'max-width: 50%; max-height:50%;' src = '" + data.path.i + "' alt = " + key.replace("@", "") + "/>");

            } else if(this.audioVariables.has(key)){
                data = this.audioVariables.get(key);

                textToPush = temp.join("<audio controls><source src = '" + data.path.i + "'> Your Browser Does not support the audio element </audio>");
            }

            //textToPush = temp.join("<img style = 'max-width: 50%; max-height:50%;' src = '" + data.path.i + "' alt = " + key + "/>");
            
            /*if(data.uploaded) {
                
            }
            if(!data.uploaded) {
                textToPush = temp.join("<img style = 'max-width: 50%; max-height:50%;' src = '" + data.path + "' alt = " + key + "/>");
            }*/
        }

        return textToPush;
    }


    /**
     * Generates variable insertion text
     *  
     * @function injectVariableText
     */
    injectVariableText(){
        var inject = "";

        this.variables.forEach(function(data, key){
            inject += "(set: ";
            inject += key;
            inject += " to &quot;";
            inject += data.value;
            inject += "&quot;)\n"
        });
        
        inject += "(hidden:)[image:"

        this.imageVariables.forEach(function(data, key){
            //console.log(key + ": " + JSON.stringify(data));

            inject += key + "{" + data.path.i + " " + data.fileName + "},"
        });

        inject += "]\n"

        inject += "(hidden:)[audio:"

        this.audioVariables.forEach(function(data, key){

            inject += key + "{" + data.path.i + " " + data.fileName + "},"

        });

        inject += "]\n"

        return inject;
        
    }


    /**
     * Get cloud save story
     * 
     * @function generateSaveStory
     * @returns {Story} story to be pushed to cloud;
     */
    generateSaveStory(){

        this.css = "";

        var cloudStory = new Story(JSON.parse(JSON.stringify(this.baseStory)));

        for(var i = 0; i < cloudStory.passages.length; i++){

            var passageObj = JSON.parse(JSON.stringify(this.exportedStoryPages[i].linkPassage));

            cloudStory.passages[i] = new Passage(passageObj.name, passageObj.tags, passageObj.metadata, passageObj.text, passageObj.pid);

            cloudStory.passages[i].text = cloudStory.passages[i].text.trim();

            if(cloudStory.passages[i].tags.includes(VAR_TAG)){
                
                //console.log("Text Changed:" + this.baseStory.passages[i].text);    
                cloudStory.passages[i].text = cloudStory.passages[i].text +  "\n"  + this.injectVariableText();
            } 
            
            this.css += this.exportedStoryPages[i].injectCSSText() + '\n';
        }

        return cloudStory;
    }


    /** 
     * Generate the story with the revised text.
     * 
     * @function generateStoryText
     * @returns {void}
     */
    generateStoryText(hidden, inVariables, inMedia) {

        //this.exportedStoryText = [];

        let scriptPassages = this.baseStory.getStoryPassages();

        for (var i = 0; i < scriptPassages.length; i++) {

            var textToPush = scriptPassages[i].text;

            textToPush = this.processTextVariables(textToPush, hidden, inVariables);
            textToPush = this.processMediaVariables(textToPush, hidden, inMedia);
            
            while(textToPush.includes("]]") || textToPush.includes("[[")){ 
                textToPush = textToPush.replace('[[', "<u>");
                textToPush = textToPush.replace(']]', "</u>");
            }
            

            while (textToPush.includes("&quot;") || textToPush.includes("&#39;") || textToPush.includes("&gt;") || textToPush.includes("&lt;")) {
                textToPush = textToPush.replace("&quot;", "\"");
                textToPush = textToPush.replace("&#39;", "'");
                textToPush = textToPush.replace("&lt;", "<");
                textToPush = textToPush.replace("&gt;", ">");
            }
            
            //textToPush = textToPush.replace(/(\r\n|\r|\n){2,}/g, '\n');

            var nPassage = new Passage(scriptPassages[i].name, 
                scriptPassages[i].tags, scriptPassages[i].metadata, textToPush, scriptPassages[i].pid);

            this.exportedStoryPages[i].dispPassage = nPassage;
            this.exportedStoryPages[i].pageName = nPassage.name;
            this.exportedStoryPages[i].story = this.baseStory;
            this.exportedStoryPages[i].pages = this.baseStory.getStoryPassages().length;

        }
    }


    processTextVariables(textToPush, hidden, inVariables){
        var sortedKeys = [];

        this.variables.forEach(
            function(value, key){
                sortedKeys.push(key);
            }
        );

        sortedKeys = sortedKeys.sort(function(a, b){
            return b.length - a.length;
        });            

        for(var j = 0; j < sortedKeys.length; j++){
            
            //console.log("KEY: " + sortedKeys[j])

                //console.log("KEY: " + key + " VALUE: " + value)
            var key = sortedKeys[j];    
            var temp = textToPush.split(key);
            var data = this.variables.get(key);

            if(!hidden){
                if(inVariables){
                    textToPush = temp.join("<span style = 'color:" + data.color + ";'><strong>(" + key.replace("$", "") + ")</strong></span>" + data.value);
                } else {
                    textToPush = temp.join("<span>(" + key.replace("$", "") + ")</span>" + data.value);
                }
            } else {
                if(inVariables){
                    textToPush = temp.join("<span style = 'color:" + data.color + ";'><strong>" + data.value + "</strong></span>");
                } else{
                    textToPush = temp.join("<span>" + data.value + "</span>");   
                }
            }
            
        }

        return textToPush;
    }


    processMediaVariables(textToPush, hidden, inMedia){
        
        var sortedKeys = [];

        this.imageVariables.forEach(
            function(value, key){
                sortedKeys.push(key);
            }
        );

        this.audioVariables.forEach(
            function(value, key){
                sortedKeys.push(key);
            }
        );

        sortedKeys = sortedKeys.sort(function(a, b){
            return b.length - a.length;
        });            

        for(var j = 0; j < sortedKeys.length; j++){
            
            //console.log("KEY: " + sortedKeys[j])

                //console.log("KEY: " + key + " VALUE: " + value)
            var key = sortedKeys[j];    
            var temp = textToPush.split(key);
            var data = this.imageVariables.has(key) ? this.imageVariables.get(key) : this.audioVariables.get(key);
            
            var value = "";

            if(data.fileName.length > 30){
                value = data.fileName.substr(0, 30) + "...";
            } else {
                value = data.fileName;
            }

            if(value == ""){
                value = "No File Uploaded";
            }

            if(!hidden){
                if(inMedia){
                    textToPush = temp.join("<span style = 'color:" + data.color + ";'><strong>(" + key.replace("@", "") + ")</strong></span>" + value);
                } else {
                    textToPush = temp.join("<span>(" + key.replace("@", "") + ")</span>" + value);
                }
            } else {
                if(inMedia){
                    textToPush = temp.join("<span style = 'color:" + data.color + ";'><strong>(" + value + ")</strong></span>");
                } else {
                    textToPush = temp.join("<span>(" + value + ")</span>");
                }
            }
            
        }

        return textToPush;
    }

    generatePublishStory(){
        this.css = "";

        var cloudStory = new Story(JSON.parse(JSON.stringify(this.baseStory)));

        for(var i = 0; i < cloudStory.passages.length; i++){

            var passageObj = JSON.parse(JSON.stringify(this.exportedStoryPages[i].linkPassage));

            cloudStory.passages[i] = new Passage(passageObj.name, passageObj.tags, passageObj.metadata, passageObj.text, passageObj.pid);

            cloudStory.passages[i].text = cloudStory.passages[i].text.trim();

            if(cloudStory.passages[i].tags.includes(VAR_TAG)){
                
                //console.log("Text Changed:" + this.baseStory.passages[i].text);    
                cloudStory.passages[i].text = cloudStory.passages[i].text +  "\n"  + this.injectPublishVariableText();
            } 
            
            this.css += this.exportedStoryPages[i].injectCSSText() + '\n';
        }

        this.css += "body{ text-align: center;}"

        return cloudStory;
    }

      /**
     * Generates variable insertion text
     *  
     * @function injectVariableText
     */
    injectPublishVariableText(){
        var inject = "";

        this.variables.forEach(function(data, key){
            inject += "(set: ";
            inject += key;
            inject += " to &quot;";
            inject += "(" + key.replace("$", "") + ")";
            inject += "&quot;)\n"
        });
        
        inject += "(hidden:)[image:"

        this.imageVariables.forEach(function(data, key){
            //console.log(key + ": " + JSON.stringify(data));

            inject += key + "{ },"
        });

        inject += "]\n"

        inject += "(hidden:)[audio:"

        this.audioVariables.forEach(function(data, key){

            inject += key + "{ },"

        });

        inject += "]\n"

        return inject;
        
    }


    destroy(){
        /*this.imageVariables.forEach(function(data){
            if(data.path.includes("blob")){
                URL.revokeObjectURL(data.path);
                data.path = "";
            }
            
        });

        this.audioVariables.forEach(function(data){
            if(data.path.includes("blob")){
                URL.revokeObjectURL(data.path);
                data.path = "";
            }
            
        });*/
    }
}

module.exports = StoryEditor;
