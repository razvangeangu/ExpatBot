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

    var botResponse;

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
        react: function react(text, callback) {
	    var r = text.toLowerCase();
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
			pattern.callback(matches, response, callback);
		    } else {
		    	callback(this.addChatEntry(response, "bot"));
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

function parse(message, callback) {
    ChatBot.addChatEntry(message, "human");
    ChatBot.react(message, function(result) {
		callback(result);
	});
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

ChatBot.addPattern("(.*)", undefined, function(matches, response, callback) {
	getId(matches[0], function(result) {
		callback(formatMessage('title', 'text', result), "bot");
	});
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


var request = require('request');

function getData(url, callback) {
	request(url, function (error, response, body) {
  		if (!error && response.statusCode == 200) {
			return callback(JSON.parse(body));
	  	}
	})
}

function getId(countryName, callback) { 
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-liste_pays.json", function(response) { 
		for(var item in response) { 
			if(response[item]["nom"].toLowerCase().match(countryName)) { 
				callback(response[item]["iso2"]); 
			}
		}
	}); 
}

function getCoordinates(idCountry, callback) { 
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-liste_pays.json", function(response) {
		for (var item in response) {
			if(item == idCountry) { 
				callback({'latitude': response[item]['latitude'], 'longitude': response[item]['longitude']});
			}
		}
	});
}

function getName(idCountry, callback) {
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-liste_pays.json", function(response) {
		for (var item in response) { 
	 		if(item == idCountry) {
	 			callback(response[item]["nom"]); 
	 		}
 		}
	});
 	
} 

function getFlag(idCountry, callback) {
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-liste_pays.json", function(response) { 
		for (var item in response) { 
 			if(item == idCountry) { 
 				callback(response[item]["vignette"]); 
 			}
 		}
	}); 
}

function getEmbassy(idCountry, callback) { 
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-representations.json", function(response){ 
		for (var item in response) { 
			if(item == idCountry) { 
				for (var i in response[item]) { 
					if(response[item][i]['type'].match('ambassade')) { 
						callback(response[item][i]); 
					}
				}
			}
		}
	});
}

function getConsulat(idCountry, callback) { 
	var consulates = [];
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-representations.json", function(response){ 
		for (var item in response) { 
			if(item == idCountry) { 
				for(var i in response[item]) { 
					if(response[item][i]["type"].match('consul')) { 
						consulates.push(response[item][i]);
					}
				}
			}
		}
		callback(consulates);
	}); 
}

//CODES: securite, entree, sante, complements (info ultiles), numeros, voyageurs_affaires
function getCountryDetails(idCountry, code, callback) {
	return getData('http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-fiche_pays_' + idCountry + '.json', function(response) {
		for(var item in response) { 
			for (var i in response[item]) {
				if (response[item][i]["code"] && response[item][i]["code"].match(code)) {
					callback(response[item][i]);
				}
			}
		}
	})
}


function getAlerts(callback) { 
	var alerts = []; 
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-alertes.json", function(response) { 
		for(var item in response['alertes']) { 
			alerts.push(response['alertes'][item]);
		}
		callback(alerts); 
	}); 
}


function getCheckAlert(idCountry,callback) { 
	var alerts = []; 
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-dernieres-minutes.json", function(response) {
		for(var item in response) { 
			if(response[item]["iso2"].match(idCountry)) { 
				alerts.push(response[item]); 
			}
		} 
		callback(alerts); 
	}); 
}

module.exports.parse = parse;
