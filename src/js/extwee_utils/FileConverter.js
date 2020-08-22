var HTMLParser = require('./HTMLParser.js');
var TweeWriter = require('./TweeWriter.js')
var HTMLWriter = require('./HTMLWriter.js');
var TweeParser = require('./TweeParser.js')
var StoryFormatParser = require('./StoryFormatParser');
const { default: Axios } = require('axios');


/**
 * @class FileConverter
 * @module FileConverter
 */
class FileConverter {
    /**
     * @function HTweeFileReader
     * @class
     * @param {String} contents - File content to parse
	 * @param {String}	nStoryFormat- story format to parse into
	 * @param {Boolean} isHTML - File is HTML
     */
	constructor(contents, isHTML) {
		this.htmlBlob = null;
		this.tweeBlob = null;
		this.story = null;
		this.storyFormat = null;
		this.contents = contents;

		this.extractStory(isHTML);
		this.extractStoryFormat();
	}

	/**
     * Extract story from file contents
     *
     * @function extractStory
	 * @param {Boolean} isHTML - File is HTML
     * @returns {void}
     */
	extractStory(isHTML) {
		if (isHTML) {
			var hparse = new HTMLParser(this.contents);
			this.story = hparse.story;
		} else {
			var tparse = new TweeParser(this.contents);
			this.story = tparse.story;
		}
	}
	
	/**
	 * Extract storyFormat from file contents
	 * 
	 * @function extractStoryFormat
	 */
	extractStoryFormat(){

		Axios.get("/storyformats/harlowe-3/format.js").then(response => {

			let format = new StoryFormatParser(response.data);
			this.storyFormat = format.storyformat;
		})

	}


	/**
     * Convert from Twee to HTML
     *
     * @function TweeToHTML
	 * @param {string} css - Extra css
	 * @param {string} js - Extra js
     * @returns {string}
     */
	html(css, js) {
		let htmlWrite = new HTMLWriter(this.story, this.storyFormat, css, js);
		return htmlWrite.output;
	}

	/**
     * Convert from HTML to Twee
     *
     * @function HTMLtoTwee
     * @returns {string}
     */
	twee() {
		let twrite = new TweeWriter(this.story);
		return twrite.output;
	}

	/**
     * Convert from Twee to HTML
     *
     * @function TweeToHTML
	 * @param {string} css - Extra css
	 * @param {string} js - Extra js
     * @returns {void}
     */
	shtml(story, css = "", js = "") {
		let htmlWrite = new HTMLWriter(story, this.storyFormat, css, js);

		this.htmlBlob = htmlWrite.output;
	}

	/**
     * Convert from HTML to Twee
     *
     * @function HTMLtoTwee
     * @returns {void}
     */
	stwee(story) {
		let twrite = new TweeWriter(story);
		this.tweeBlob = twrite.output;
	}
}

module.exports = FileConverter;