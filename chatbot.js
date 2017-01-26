var ChatBot = function () {

    //// common vars
    // custom patterns and rewrites
    var patterns;

    // the bot's name
    var botName;

    // the human's name
    var humanName;

    // a callback for after a chat entry has been added
    var addChatEntryCallback;

    return {
        init: function() {
            var settings = {
                // these are the defaults.
                botName: 'Bot',
                humanName: 'You',
                patterns: [],
                addChatEntryCallback: function(text, origin) {
               	    return text;
		}
            }

            botName = settings.botName;
            humanName = settings.humanName;
            patterns = settings.patterns;
            addChatEntryCallback = settings.addChatEntryCallback;
        },
        setBotName: function (name) {
            botName = name;
        },
        setHumanName: function (name) {
            humanName = name;
        },
        addChatEntry: function addChatEntry(text, origin) {
            if (text == undefined) {
                return;
            }
            if (text == '') {
                text = 'Sorry, I have no idea.';
            }
            
	    if (addChatEntryCallback != undefined) {
                return addChatEntryCallback.call(this, text, origin);
            }
        },
        react: function react(text) {
			var r=text.toLowerCase();
			r = r.replace(new RegExp(/[àáâãäå]/g),"a");
			r = r.replace(new RegExp(/æ/g),"ae");
			r = r.replace(new RegExp(/ç/g),"c");
			r = r.replace(new RegExp(/[èéêë]/g),"e");
			r = r.replace(new RegExp(/[ìíîï]/g),"i");
			r = r.replace(new RegExp(/ñ/g),"n");
			r = r.replace(new RegExp(/[òóôõö]/g),"o");
			r = r.replace(new RegExp(/œ/g),"oe");
			r = r.replace(new RegExp(/[ùúûü]/g),"u");
			r = r.replace(new RegExp(/[ýÿ]/g),"y");
			r = r.replace(new RegExp(/\?/g), "");
			// console.log(r);
			text = r;


            // check for custom patterns
            for (var i = 0; i < patterns.length; i++) {
                var pattern = patterns[i];
                var r = new RegExp(pattern.regexp, "i");
                var matches = text.match(r);
                //console.log(matches);
                if (matches) {
		    var response = pattern.actionValue;
		    if (response != undefined) {
			for (var j = 1; j < matches.length; j++) {
			    response = response.replace("$" + j, matches[j]);
			}
		    }
		    if (pattern.callback != undefined) {
			return pattern.callback.call(this, matches, response);
		    } else {
		    	return this.addChatEntry(response, "bot");
                    }
		}
            }
        },
        addPatternObject: function (obj) {
            patterns.push(obj);
        },
        addPattern: function (regexp, actionValue, callback) {
            var obj = {
                regexp: regexp,
                actionValue: actionValue,
		callback: callback
            };
            this.addPatternObject(obj);
        }

    }
}();

function parse(message) {
    ChatBot.addChatEntry(message, "human");
    return ChatBot.react(message);
}

ChatBot.init();

// ChatBot.addPattern(pattern, responseObject)

function formatMessage(message, type, content) {
	var messageData = {
		title: message,
      		body: [
			{
			  type: type,
			  content: content
			}
		]
	}

	return messageData;
}

ChatBot.addPattern("^hi$", "Howdy, friend", function(matches, response) {
	return response + " I GOT YA " + matches;
});

//ChatBot.addPattern("(?:my name is|I'm|I am) (.*)", "hi $1, thanks for talking to me today", function (matches) {
//     ChatBot.setHumanName(matches[1]);
//},"Say 'My name is [your name]' or 'I am [name]' to be called that by the bot");
// ChatBot.addPattern("(what is the )?meaning of life", "response", "42", undefined, "Say 'What is the meaning of life' to get the answer.");
//ChatBot.addPattern("compute ([0-9]+) plus ([0-9]+)", "response", undefined, function (matches) {
//    ChatBot.addChatEntry("That would be "+(1*matches[1]+1*matches[2])+".","bot");
//},"Say 'compute [number] plus [number]' to make the bot your math monkey");

// Create API call for querry
// Figure out what querries should we include

module.exports.parse = parse;
