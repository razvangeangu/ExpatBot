var ChatBot = function () {

    //// common vars
    // custom patterns and rewrites
    var patterns;

    // the bot's name
    var botName;

    // the human's name
    var humanName;

    // a selector to all inputs the human can type to
    var inputs;

    // the example phrases that can be said (to be listed under the input field)
    var examplePhrases = [];

    // whether a sample conversation is running
    var sampleConversationRunning = false;

    // a callback for after a chat entry has been added
    var addChatEntryCallback;

    return {
        init: function() {
            var settings = {
                // these are the defaults.
                botName: 'Bot',
                humanName: 'You',
                patterns: [],
                addChatEntryCallback: function(entryDiv, text, origin) {
                    entryDiv.addClass('appear');
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
            //var entryDiv = $('<div class="chatBotChatEntry ' + origin + '"></div>');
            //entryDiv.html('<span class="origin">' + (origin == 'bot' ? botName : humanName) + '</span>' + text);
            //$('#chatBotHistory').prepend(entryDiv);
            //if (addChatEntryCallback != undefined) {
            //    addChatEntryCallback.call(this, entryDiv, text, origin);
            //}
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
                    switch (pattern.actionKey) {
                        case 'rewrite':
                            text = pattern.actionValue;
                            for (var j = 1; j < matches.length; j++) {
                                text = text.replace("$" + j, matches[j]);
                            }
                            //console.log("rewritten to " + text);
                            if (pattern.callback != undefined) {
                                pattern.callback.call(this, matches);
                            }
                            break;
                        case 'response':
//                                var response = text.replace(r, pattern.actionValue);
                            var response = pattern.actionValue;
                            if (response != undefined) {
                                for (var j = 1; j < matches.length; j++) {
                                    response = response.replace("$" + j, matches[j]);
                                }
                                this.addChatEntry(response, "bot");
                            }
                            if (pattern.callback != undefined) {
                                pattern.callback.call(this, matches);
                            }
                            return;
                    }
                    break;
                }
            }
        },
        addPatternObject: function (obj) {
            patterns.push(obj);
        },
        addPattern: function (regexp, actionKey, actionValue, callback, description) {
            var obj = {
                regexp: regexp,
                actionKey: actionKey,
                actionValue: actionValue,
                description: description,
                callback: callback
            };
            this.addPatternObject(obj);
        }

    }
}();

function parse(message) {
    ChatBot.addChatEntry(message, "human");
    ChatBot.react(message);
}

ChatBot.init();

// 1. parameter: the pattern to listen for 
// 2. parameter: either "response" to respond or "rewrite" to rewrite the request 
// 3. parameter: either the response or the rewrite value, or undefined if nothing should happen 
// 4. parameter: a callback function that gets the matches of the pattern 
// 5. parameter: a description of that pattern, this is used to tell the user what he can say. Use quotes '' to mark phrases and [] to mark placeholders 
function addPattern(pattern, responseString, callback, placeholders) {
    ChatBot.addPattern(pattern, "response", responseString, callback, placeholders)
}

ChatBot.addPattern("^hi$", "response", "Howdy, friend", undefined, "Say 'Hi' to be greeted back.");
// ChatBot.addPattern("^bye$", "response", "See you later buddy", undefined, "Say 'Bye' to end the conversation.");
// ChatBot.addPattern("(?:my name is|I'm|I am) (.*)", "response", "hi $1, thanks for talking to me today", function (matches) {
//     ChatBot.setHumanName(matches[1]);
// },"Say 'My name is [your name]' or 'I am [name]' to be called that by the bot");
// ChatBot.addPattern("(what is the )?meaning of life", "response", "42", undefined, "Say 'What is the meaning of life' to get the answer.");
ChatBot.addPattern("compute ([0-9]+) plus ([0-9]+)", "response", undefined, function (matches) {
    ChatBot.addChatEntry("That would be "+(1*matches[1]+1*matches[2])+".","bot");
},"Say 'compute [number] plus [number]' to make the bot your math monkey");

// Create API call for querry
// Figure out what querries should we include

module.exports.parse = parse;
