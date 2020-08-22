/**
 * @class Page
 * @module Page
 */
class Page {
    /**
     * @function Page
     * @class 
     * @param passage - Passage Object\
     */
	constructor(dispPassage, linkPassage, theme, pageNumber, metadata) {
		this.dispPassage = dispPassage;
		this.linkPassage = linkPassage;

		this.story = metadata.story;
		this.pages = metadata.pages;

		this.theme = theme;
		this.pageNumber = pageNumber;
		this.pageName = this.linkPassage.name;

		this.imageFiles = [];
		this.audioFiles = [];
		this.links = [];

		var found = false;

		for(var i = 0; i < this.linkPassage.tags.length; i++){	
			if(this.linkPassage.tags[i].includes("theme_")){
				this.linkPassage.tags[i] = "theme_" + this.pageNumber;
				found = true;
			} 
		}

		if(!found){
			this.linkPassage.tags.push("theme_" + this.pageNumber);
		}

		this.reparseLinks();
	}

	/**
	 * Inserts a link to the bottom of the page
	 * 
	 * @function addLink
	 * @param {String} name 
	 */
	addLink(name){
		this.linkPassage.text += "\n[[" + name + "]]";
	}

	/**
	 * Removes all instances of a link from a page.
	 * 
	 * @function removeLink
	 * @param {String} name 
	 */
	removeLink(name){
		var process = false;

		for(var i = 0; i < this.links.length; i++){
			if(this.links[i].name == name){ process = true; }
		}

		if(process){
			var source = this.linkPassage.text;

			source = source.split("[[");

			for(var j = 0; j < source.length; j++){
				if(source[j].includes("]]")){

					var sourceSplit = source[j].split("]]");

					var passageName = sourceSplit[0];
					
					//console.log(passageName);

					var contains = passageName.includes(name);

					if(!contains){
						sourceSplit[0] = passageName;
						source[j] = sourceSplit.join("]]");
					} else {
						sourceSplit[0] = "";
						source[j] = sourceSplit.join("");
					}
				}
			}
			
			source = source.filter(str => str != "");
			this.linkPassage.text = source.join("[[");
			
			this.linkPassage.text = this.linkPassage.text.trim();

			this.validate();

			this.reparseLinks();
			this.reparseMedia();
		}
	}

	reparseMedia(imageVarMap, audioVarMap){
		this.imageFiles = [];
		this.audioFiles = [];

		var sortedKeys = [];

		imageVarMap.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
		);

		audioVarMap.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
		)

		sortedKeys = sortedKeys.sort(function(a, b){
			return b.length - a.length;
		});

		var source = this.linkPassage.text;

		for(var i = 0; i < sortedKeys.length; i++){
			if(source.includes(sortedKeys[i])){
				
				if(audioVarMap.has(sortedKeys[i])){
					this.audioFiles.push({name: sortedKeys[i]});
				} else if(imageVarMap.has(sortedKeys[i])){
					this.imageFiles.push({name: sortedKeys[i]});
				}

				while(source.includes(sortedKeys[i])){
					source = source.replace(sortedKeys[i], "");
				}
			}
		}
	}

	/**
	 * Generate the links found in the passage
	 * @function reparseLinks
	 */
	reparseLinks(){
		var source = this.linkPassage.text;

		source = source.split("[[");

		this.links = [];
		var linksAdded = [];

		for(var j = 0; j < source.length; j++){
			if(source[j].includes("]]")){
				var passageName = source[j].split("]]")[0];
				
				//console.log(passageName);

				if(passageName.includes("-&gt;")){
					passageName = passageName.split("-&gt;")[1];
				}

				for(var k = 0; k < this.story.getStoryPassages().length; k++){
					if(this.story.getStoryPassages()[k].name == passageName){
						
						if(!linksAdded.includes(passageName)){
							this.links.push({name: passageName, location: k});
							linksAdded.push(passageName);
						}
						//console.log("Pushed:" + JSON.stringify({name: passageName, location: k}));
					}
				}
			}
		}
	}
	
	/**
	 * Replaces the links within the story
	 * 
	 * @function replaceLinks
	 * @param {Event} event 
	 */
	replaceLinks(event){
		var process = false;

		for(var i = 0; i < this.links.length; i++){
			if(this.links[i].name == event.prevName){ process = true; }
		}
		
		if(process){
			var source = this.linkPassage.text;

			source = source.split("[[");

			for(var j = 0; j < source.length; j++){
				if(source[j].includes("]]")){

					var sourceSplit = source[j].split("]]");

					var passageName = sourceSplit[0];
					
					//console.log(passageName);
					var split = false;
					var splitArr;

					if(passageName.includes("-&gt;")){
						splitArr = passageName.split("-&gt;");
						passageName = splitArr[1];
						split = true;
					}
					
					var rebuiltText = "";

					var contains = event.newName != "";

					if(passageName == event.prevName){
						if(split){
							splitArr[1] = event.newName;
							rebuiltText = splitArr.join("-&gt;");
						} else {
							rebuiltText = event.newName;
						}

						if(contains){
							sourceSplit[0] = rebuiltText;
							source[j] = sourceSplit.join("]]");
						} else {
							sourceSplit[0] = "";
							source[j] = sourceSplit.join("");
						}
					}

				}
			}
			
			source = source.filter(str => str != "");
			this.linkPassage.text = source.join("[[");
			
			this.linkPassage.text = this.linkPassage.text.trim();

			this.validate();
		}
	}

	/**
	 * Replaces all variables as dictated by the event
	 * @param {Event} event 
	 * @param {Map} variables 
	 */
	replaceVariable(event, variables){
		var sortedKeys = [];

		variables.forEach(
			function(value, key){
				sortedKeys.push(key);
			}
		);
		
		var process = sortedKeys.includes(event.prevName);
		
		if(process){
			sortedKeys = sortedKeys.sort(function(a, b){
				return b.length - a.length;
			});

			
			this.linkPassage.text = this.recursiveReplace(event, sortedKeys, this.linkPassage.text, 0);
		}
	}

	/**
	 * Replaces all the variables recursively that need to be replaced.
	 * 
	 * @function recursiveReplace
	 * @param {Event} event 
	 * @param {Array} sortedKeys 
	 * @param {String} text 
	 */
	recursiveReplace(event, sortedKeys, text, index){
		var key = sortedKeys[index]; 
		var source = text.split(key);
		
		if(key == event.prevName){
			if(source.length == 1){
				return source[0];
			}

			return source.join(event.newName);
		} else {
			var ret = "";

			for(var i = 0; i < source.length; i++){
				if(i < source.length - 1){
					ret += this.recursiveReplace(event, sortedKeys, source[i], index + 1) + key;
				} else {
					ret += this.recursiveReplace(event, sortedKeys, source[i], index + 1);
				}
			}

			return ret;
		}
	}

	/**
	 * Adds image to page
	 * 
	 * @function addImage
	 * @param {*} imageData
	 */
	addImage(imageData){

		var process = true;

		for(var i = 0; i < this.imageFiles.length; i++){
			if(this.imageFiles[i].name == imageData.name){
				process = false;
			}
		}

		if(process)
			this.imageFiles.push(imageData);

		this.linkPassage.text += "\n" + imageData.name;
	}

	/**
	 * Removes all occurences of image from page
	 * 
	 * @function removeImage
	 * @param {*} imageData 
	 */
	removeImage(imageData){

		this.removeKeyFromText(this.imageFiles.concat(this.audioFiles), imageData.name);

		this.imageFiles = this.imageFiles.filter(function(img){
			return img.name != imageData.name;
		});
	}

	/**
	 * Adds audio file to page
	 * 
	 * @function addAudio
	 * @param {*} audio 
	 */
	addAudio(audioData){
		var process = true;

		for(var i = 0; i < this.audioFiles.length; i++){
			if(this.audioFiles[i].name == audioData.name){
				process = false;
			}
		}

		if(process)
			this.audioFiles.push(audioData);

		this.linkPassage.text += "\n" + audioData.name;
	}

	/**
	 * Removes all occurences of audio from page
	 * 
	 * @function removeAudio
	 * @param {*} audio 
	 */
	removeAudio(audioData){

		this.removeKeyFromText(this.audioFiles.concat(this.imageFiles), audioData.name);

		this.audioFiles = this.audioFiles.filter(function(aud){
			return aud.name != audioData.name;
		});		
	}

	/**
	 * 
	 * Removes all occurances of 'key' from text
	 * 
	 * @function removeKeyFromText
	 * @param {Array} dataArr 
	 * @param {String} key 
	 */
	removeKeyFromText(dataArr, key){
		var sortedKeys = [];

		dataArr.forEach(
			function(value){
				sortedKeys.push(value.name);
			}
		);

		var event = {prevName: key, newName: ""};

		sortedKeys = sortedKeys.sort(function(a, b){
			return b.length - a.length;
		});
		
		
		this.linkPassage.text = this.recursiveReplace(event, sortedKeys, this.linkPassage.text, 0);

		this.validate();
	}

	/**
	 * Used to determine styling for this story.
	 * 
	 * @function injectCSSText
	 */
	injectCSSText(){
		var inject = "tw-story[tags~='";
			inject += "theme_" + this.pageNumber + "']{\n";
			inject +=  "\t" + this.theme + "\n";
			inject += "}";

		return inject;
	}

	/**
	 * @function extractCSSProperty
	 * @param property
	 * @returns {String} property description
	 */

	extractCSSProperty(property){
		var source = this.theme;

		var sourceArr = source.split(";");

		for(var i = 0; i < sourceArr.length; i++){
			
			var prop = sourceArr[i].split(":")[0].trim();
			var val = sourceArr[i].split(":")[1].trim();

			if(prop == property){
				return val;
			}

			//console.log(prop + ':' + val);
		}

		return "Property not found";
	}
	
	/**
	 * Validates and cleans the link text
	 * 
	 * @function validate
	 */
	validate(){
		var source = this.linkPassage.text.split("[[");
		var rebuild = "";

		for(var i = 0; i < source.length - 1; i++){
			
			rebuild += source[i];

			if(source[i + 1].includes("]]")){
				rebuild += "[[";
			}
		}

		rebuild += source[source.length - 1];

		this.linkPassage.text = rebuild.trim();
	}
}

module.exports = Page;
