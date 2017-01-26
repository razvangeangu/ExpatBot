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

ChatBot.addPattern("^hi$", "Howdy, friend", function(matches, response) {
	return formatMessage(response, 'text', 'this is a string coming from the API');
});


ChatBot.addPattern("(.*)erasmus(.*)(en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*) (.*)", undefined, function(matches, response) {
    return formatMessage(response, 'text', 'Le programme Erasmus est réservé aux pays de l’espace économique européen ainsi que la Turquie et la Macédoine. Il existe néanmoins le programme Erasmus mundus qui est une extension d’Erasmus à l’échelle mondiale.');
});

ChatBot.addPattern("(.*)ecoles?(.*)(en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*) (.*)", undefined, function(matches, response) {
    return formatMessage(response, 'html', '<p>Je viens de vous trouver 495 établissements français dans 137 pays regroupant regroupant plus de 340 000 étudiants de tous âges ! <\br> Voici une <a href ="http://www.aefe.fr/reseau-scolaire-mondial/rechercher-un-etablissement">carte</a> de la repartition de ces etablissements dans le monde accompagnee d’un rapport de l’AEFE sur ceux-ci.</p>');
});

ChatBot.addPattern("(.*)santes?(.*)(en|a|dans (le|la|l)?|de|du|au|le|la|l)( |')(.*) (.*)", "Je viens de vous trouver des informations concernant la santé à l'endroit suivant" + matches[6], function(matches, response) {
    return formatMessage(response, 'html', 'L’OMS ou Organisation Mondiale de la Santé, une institution spécialisée de l\'ONU, publie régulièrement des classements des meilleurs systèmes de santé mondiaux. Voici le plus recent de ces <a href = "rapports http://thepatientfactor.com/canadian-health-care-information/world-health-organizations-ranking-of-the-worlds-health-systems">rapports</a>');
});

ChatBot.addPattern("((b|B)onjour|(b|B)onsoir|(s|S)alut|(h|H)ey|(y|Y)o|hi|hello|slt|bjr)(.*)", "Bonjour ! Comment allez vous ?", function(matches, response) {
    return formatMessage(response, 'text', "En quoi puis-je vous aider ?");
});

ChatBot.addPattern("(.*)et (toi|vous)(.*)","Ca va très bien, merci !", function(matches, response) {
    return formatMessage(response, 'text', "En quoi puis-je vous aider ?");
});

ChatBot.addPattern("(.*)((comment (ca|sa) va)|(comment allez(-| )vous)|(comment vas(-| )tu)|(comment tu vas))(.*)","Ca va très bien, merci !", function(matches, response) {
    return formatMessage(response, 'text', "En quoi puis-je vous aider ?");
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
