import Axios from 'axios'
import StoryFormatParser from '@/js/extwee_utils/StoryFormatParser.js'
import StoryEditor from '@/js/extwee_utils/StoryEditor.js'
import HTMLWriter from '@/js/extwee_utils/HTMLWriter.js'
import HTMLParser from '@/js/extwee_utils/HTMLParser.js'
import TweeWriter from '@/js/extwee_utils/TweeWriter.js'
import TweeParser from '@/js/extwee_utils/TweeParser.js'

export default{

    data(){
        return{
            storyFormat: Object,
        }
    },

    methods:{
        html(tweeContent){
            var story = new TweeParser(tweeContent).story;
            var editor = new StoryEditor(story);
            
            story = editor.generateViewStory(false);

            let htmlWrite = new HTMLWriter(story, this.storyFormat, "body{text-align:center;}", "");

            return htmlWrite.output;
        },

        twee(htmlContent){
            var story = new HTMLParser(htmlContent).story;
            let tweeWrite = new TweeWriter(story);
            return tweeWrite.output;
        }
    },

    created: function(){
        Axios.get("/storyformats/harlowe-3/format.js").then(response => {

			let format = new StoryFormatParser(response.data);
			this.storyFormat = format.storyformat;
		})
    }
    

}