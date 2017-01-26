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
      		body: [
			{
			  type: 'title',
			  content: message
			},
			{
			  type: type,
			  content: content
			}
		]
	}

	return messageData;
}

ChatBot.addPattern("(.*)vaccin(.*)( )(en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*)", "response", undefined, function (matches) {
    ChatBot.addChatEntry("Les indications de vaccination pour aller au lieu suivant: " + matches[7] + " sont : text to insert Quant aux centres de vaccinations, vous trouverez une carte interactive qui vous aidera à en trouver dans votre departement!");
},"");

ChatBot.addPattern("(.*)demenage(.*)", "response", undefined, function (matches) {
    ChatBot.addChatEntry("Je vous ai trouvé un comparateur pour votre déménagement international! Voici: http://www.comparerdemenageurs.fr/v1/");
},"");

ChatBot.addPattern("(.*)(adresse|localisation|trouve)(.*)(ambassade|consulat)(.*)( )((en|a|dans (le|la)?|de|du|aux?|le|la|l?)( |'))?(.*)", "response", undefined, function (matches) {
    ChatBot.addChatEntry("L'ambassade ou consulat de France du lieu suivant: " + matches[11] + " se situe à l'adresse suivante");
},"");

ChatBot.addPattern("(.*)(animal|animaux)(.*)", "response", undefined, function (matches) {
    ChatBot.addChatEntry("Cela dépendra du nombre, du pays et de l’animal en question! Voilà une page qui vous renseignera plus en détail sur la question. https://www.service-public.fr/particuliers/vosdroits/F21374");
},"");

ChatBot.addPattern("(.*)( )visa( )(.*)( )((en|a|dans (le|la)?|de|du|aux?|le|la|l?)( |'))?(.*)", "response", undefined, function (matches) {
    ChatBot.addChatEntry("En tout cas pas vous n'avez pas besoin de visa pour les pays de l'EEE et la suite. Pour plus d'informations regardez sur cette page du service public: https://www.service-public.fr/particuliers/vosdroits/F1358");
},"");

// Create API call for querry
// Figure out what querries should we include

module.exports.parse = parse;
