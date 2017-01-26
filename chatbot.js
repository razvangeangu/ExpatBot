var fs = require('fs');

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

    var wrongEntries = fs.createWriteStream("wrongEntries.log", { flags: 'w' });

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

	    var matchedSomething = false;

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
		    	callback(text);
                    }

			matchedSomething = true;
            	}
		if (!matchedSomething && i == patterns.length - 1) {
		    wrongEntries.write(text + '\n');
		    callback({bot: true, body: [{type: 'title', content: "Oops"}, {type: 'text', content: "Pardon je n'ai pas compris votre recherche"}]});
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
      		bot: true,
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

/*ChatBot.addPattern("(.*)", undefined, function(matches, response, callback) {
	getId(matches[0], function(result) {
		callback(formatMessage('title', 'text', result), "bot");
	});
});*/

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


ChatBot.addPattern("(.*)vaccin(.*)( )(en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*)", undefined, function(matches, response, callback) {
	getId(matches[7], function(country) {
		if (country == undefined) {
			country = getCountryByCity(matches[7]);
		} else {
			country = matches[7];
		}

		getId(country, function(idCountry) {
			getCountryDetails(idCountry, "sante", function(sante_info) {
				callback(formatMessage("Les indications de vaccination pour aller au lieu suivant: " + country + " sont : ", "html", sante_info["texte"] + "\nQuant aux centres de vaccinations, vous trouverez une carte interactive qui vous aidera à en trouver dans votre departement!"));
			});
		});
	});

});

//ChatBot.addPattern("(.*)et (toi|vous)(.*)", formatMessage("Ca va très bien, merci !", 'text', "En quoi puis-je vous aider ?"), undefined);

ChatBot.addPattern("(.*)et (toi|vous)(.*)", undefined, function(matches, response, callback) {
	callback(formatMessage("Ca va très bien, merci !", 'text', "En quoi puis-je vous aider ?"));
});

ChatBot.addPattern("(.*)santes?(.*) (en|a|dans (le|la|l)?|de|du|au|le|la|l)( |')(.*) (.*)", undefined, function(matches, response, callback) {
        callback(formatMessage("Je viens de vous trouver des informations concernant la santé à l'endroit suivant", 'html', "L’OMS ou Organisation Mondiale de la Santé, une institution spécialisée de l\'ONU, publie régulièrement des classements des meilleurs systèmes de santé mondiaux. Voici le plus recent de ces \<a href = \"rapports http://thepatientfactor.com/canadian-health-care-information/world-health-organizations-ranking-of-the-worlds-health-systems\"\>rapports\</a\>"));
});


ChatBot.addPattern("(.*)erasmus(.*) (en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*) (.*)", undefined, function(matches, response, callback) {
        callback(formatMessage(undefined, 'text', "Le programme Erasmus est réservé aux pays de l’espace économique européen ainsi que la Turquie et la Macédoine. Il existe néanmoins le programme Erasmus mundus qui est une extension d’Erasmus à l’échelle mondiale."));
});


ChatBot.addPattern("(.*)ecoles?(.*) (en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*) (.*)", undefined, function(matches, response, callback) {
        callback(formatMessage(undefined, 'html', "<p>Je viens de vous trouver 495 établissements français dans 137 pays regroupant regroupant plus de 340 000 étudiants de tous âges ! <\br> Voici une <a href =\"http://www.aefe.fr/reseau-scolaire-mondial/rechercher-un-etablissement\">carte</a> de la repartition de ces etablissements dans le monde accompagnee d’un rapport de l’AEFE sur ceux-ci.</p>"));
});


ChatBot.addPattern("(.*)ecoles?(.*) (en|a|dans (le|la)?|de|du|au|le|la|l?)( |')(.*) (.*)", undefined, function(matches, response, callback) {
        callback(formatMessage(undefined, 'html', "<p>Je viens de vous trouver 495 établissements français dans 137 pays regroupant regroupant plus de 340 000 étudiants de tous âges ! <\br> Voici une <a href =\"http://www.aefe.fr/reseau-scolaire-mondial/rechercher-un-etablissement\">carte</a> de la repartition de ces etablissements dans le monde accompagnee d’un rapport de l’AEFE sur ceux-ci.\</p\>"));
});


ChatBot.addPattern("((b|B)onjour|(b|B)onsoir|(s|S)alut|(h|H)ey|(y|Y)o|hi|hello|slt|bjr)(.*)", undefined, function(matches, response, callback) {
        callback(formatMessage("Ca va très bien, merci !", 'text', "En quoi puis-je vous aider ?"));
});


ChatBot.addPattern("(.*)(animal|animaux)(.*)", "response", undefined, function(matches, response, callback) {
        callback(formatMessage(undefined, 'html', "Cela dépendra du nombre, du pays et de l’animal en question! Voilà une page qui vous renseignera plus en détail sur la question. https://www.service-public.fr/particuliers/vosdroits/F21374"));
});


ChatBot.addPattern("(.*)( )visa( )(.*)( )((en|a|dans (le|la)?|de|du|aux?|le|la|l?)( |'))?(.*)", undefined, function(matches, response, callback) {
        callback(formatMessage(undefined, 'html', "En tout cas pas vous n'avez pas besoin de visa pour les pays de l'EEE et la suite. Pour plus d'informations regardez sur cette page du service public: https://www.service-public.fr/particuliers/vosdroits/F1358"));
});

ChatBot.addPattern("(.*)demenage(.*)", undefined, function(matches, response, callback) {
        callback(formatMessage(undefined, 'html', "Je vous ai trouvé un comparateur pour votre déménagement international! Voici: http://www.comparerdemenageurs.fr/v1/"));
});


// address of the embassy
ChatBot.addPattern("(.*)ambassade( )((de france|francaise)( ))?(en|a|dans (le|la)?|de|du|aux?|le|la|l|d?)( |')([a-z\-]*)(.*)", undefined, function(matches, response, callback) {
        getId(matches[10], function(country) {
                if (country == undefined) {
                        country = getCountryByCity(matches[10]);
                }

                getId(country, function(idCountry) {
                        getEmbassy(idCountry, function(address) {
                                callback(formatMessage("L'ambassade de France du lieu suivant: : " + country + " se situe à l'adresse suivante : ", "html", address));
                        });
                });
        });

});


// address of the consulat TO VERIFY

ChatBot.addPattern("(.*)consulat( )((de france|francaise)( ))?(en|a|dans (le|la)?|de|du|aux?|le|la|l|d?)( |')([a-z\-]*)(.*)", undefined, function(matches, response, callback) {
        getId(matches[10], function(country) {
                if (country == undefined) {
                        country = getCountryByCity(matches[10]);
                }

                getId(country, function(idCountry) {
                        getConsulat(idCountry, function(address) {
                                callback(formatMessage("Les consulats de France du lieu suivant: " + country + " se situent aux adresses suivantes : ", "html", address));
                        });
                });
        });

});



// sanitary info for each country 

ChatBot.addPattern("(.*)vaccin(.*)( )(en|a|dans (le|la)?|de|du|au|le|la|l?)( |')([a-z\-]*)(.*)", undefined, function(matches, response, callback) {
        getId(matches[7], function(country) {
                if (country == undefined) {
                        country = getCountryByCity(matches[7]);
                }

                getId(country, function(idCountry) {
                        getCountryDetails(idCountry, "sante", function(sante_info) {
                                callback(formatMessage("Les indications de vaccination pour aller au lieu suivant: " + country + " sont : ", "html", sante_info["texte"] + "\nQuant aux centres de vaccinations, vous trouverez une carte interactive qui vous aidera à en trouver dans votre departement!"));
                        });
                });
        });

});

ChatBot.addPattern("(.*)((voter?)|(procuration)|(election)|(electorale?))(.*) (en|a|dans (le|la|l)?|de|du|aux?|le|la|l)( |')([a-z\-]*)(.*)", undefined, function(matches, response, callback) {
    
    callback(formatMessage(response, 'text', "Pour voter en France, depuis le lieu \""+ matches[11]+"\", il est possible de faire une procuration ou bien de vous inscrire sur les listes électorales du consulat ou ((de l('| )ambassade) | (du consulat)) depuis le lieu \""+ matches[11]+"\", afin de voter sur place."));
});

//ChatBot.addPattern("(.*)et (toi|vous)(.*)", formatMessage("Ca va très bien, merci !", 'text', "En quoi puis-je vous aider ?"), undefined);

ChatBot.addPattern("(.*)et (toi|vous)(.*)", undefined, function(matches, response, callback) {
        callback(formatMessage("Ca va très bien, merci !", 'text', "En quoi puis-je vous aider ?"));
});

function getCountryByCity(city, callback) {

	var countries = {
		"delta de la riviere des perles":"chine",
		"tokyo":"japon",
		"jakarta":"indonesie",
		"seoul":"coree du sud",
		"karachi":"pakistan",
		"shanghai":"chine",
		"manille":"philippines",
		"new york":"etats-unis",
		"lagos":"nigeria",
		"le caire":"egypte",
		"mumbai": "inde",
		"bombay": "inde",
		"delhi":"inde",
		"beijing": "chine",
		"pekin": "chine",
		"sao paulo":"bresil",
		"mexico":"mexique",
		"osaka-kyoto-kobe":"japon",
		"bangkok": "thailande",
		"krung thep": "thailande",
		"los angeles":"etats-unis",
		"kolkata": "inde",
		"calcutta": "inde",
		"chongqing":"chine",
		"teheran":"iran",
		"buenos aires":"argentine",
		"moscou":"russie",
		"istanbul":"turquie",
		"chengdu":"chine",
		"londres":"royaume-uni",
		"ho-chi-minh-ville": "viet nam",
		"thanh phố hồ chi minh": "viet nam",
		"gauteng": "afrique du sud",
		"johannesbourg-pretoria": "afrique du sud",
		"dacca":"bangladesh",
		"guangzhou": "chine",
		"canton": "chine",
		"paris":"france",
		"rio de janeiro":"bresil",
		"kinshasa":"republique democratique du congo",
		"ruhr":"allemagne",
		"nagoya":"japon",
		"tianjin":"chine",
		"bogota":"colombie",
		"lima":"perou",
		"bagdad":"irak",
		"shenzhen":"chine",
		"wuhan":"chine",
		"chicago":"etats-unis",
		"washington":"etats-unis",
		"hong kong": "chine",
		"xianggang": "chine",
		"taipei":"taiwan",
		"chennai": "inde",
		"madras": "inde",
		"bangalore":"inde",
		"san francisco": "etats-unis",
		"san jose": "etats-unis",
		"nairobi":"kenya",
		"milan": "italie",
		"milano": "italie",
		"dongguan":"chine",
		"boston":"etats-unis",
		"kuala lumpur":"malaisie",
		"bandung":"indonesie",
		"randstat":"pays-bas",
		"alger":"algerie",
		"hyderabad":"inde",
		"hanoi": "viet nam",
		"ha nội": "viet nam",
		"dallas - fort worth":"etats-unis",
		"santiago":"chili",
		"rangoun":"myanmar (birmanie)",
		"foshan":"chine",
		"khartoum":"soudan",
		"philadelphie":"etats-unis",
		"lahore":"pakistan",
		"luanda":"angola",
		"houston":"etats-unis",
		"nanjing":"chine",
		"shenyang":"chine",
		"singapour":"singapour",
		"miami":"etats-unis",
		"semarang":"indonesie",
		"surabaya":"indonesie",
		"madrid":"espagne",
		"atlanta":"etats-unis",
		"ahmadabad":"inde",
		"riyad":"arabie saoudite",
		"toronto":"canada",
		"ibadan":"nigeria",
		"colombo":"sri lanka",
		"belo horizonte":"bresil",
		"hangzhou":"chine",
		"xian":"chine",
		"dar es salam":"tanzanie",
		"pune":"inde",
		"barcelone":"espagne",
		"doubai":"emirats arabes unis",
		"shantou":"chine",
		"detroit":"etats-unis",
		"saint-petersbourg":"russie",
		"ankara":"turquie",
		"harbin":"chine",
		"alexandrie":"egypte",
		"san diego - tijuana":"etats-unis",
		"kano":"nigeria",
		"johannesbourg":"afrique du sud",
		"caracas":"venezuela",
		"accra":"ghana",
		"sydney":"australie",
		"guadalajara":"mexique",
		"abidjan":"cote d'ivoire",
		"busan":"coree du sud",
		"kiev":"ukraine",
		"hyderabad":"pakistan",
		"seattle":"etats-unis",
		"surat":"inde",
		"xiamen":"chine",
		"phoenix":"etats-unis",
		"addis-abeba":"ethiopie",
		"medan":"indonesie",
		"berlin":"allemagne",
		"monterrey":"mexique",
		"melbourne":"australie",
		"naples": "italie",
		"napoli": "italie",
		"koweit":"koweit",
		"amman":"jordanie",
		"bamako":"mali",
		"rome": "italie",
		"roma": "italie",
		"fukuoka-kitakyushu":"japon",
		"casablanca":"maroc",
		"izmir":"turquie",
		"guatemala":"guatemala",
		"djeddah":"arabie saoudite",
		"porto alegre":"bresil",
		"suzhou":"chine",
		"montreal":"canada",
		"taichung - changhua":"taiwan",
		"chittagong":"bangladesh",
		"guayaquil":"equateur",
		"le cap": "afrique du sud",
		"capitale legislative": "afrique du sud",
		"francfort":"allemagne",
		"jinan":"chine",
		"salvador":"bresil",
		"øresund":"danemark",
		"minneapolis":"etats-unis",
		"athenes":"grece",
		"recife":"bresil",
		"kaboul":"afghanistan",
		"bassorah":"irak",
		"port-au-prince":"haiti",
		"medellin":"colombie",
		"brasilia":"bresil",
		"damas":"syrie",
		"ethekwini": "afrique du sud",
		"durban": "afrique du sud",
		"kanpur":"inde",
		"kaohsiung":"taiwan",
		"curitiba":"bresil",
		"ispahan":"iran",
		"tel aviv-jaffa":"israel",
		"wuxi":"chine",
		"saint-domingue":"republique dominicaine",
		"fortaleza":"bresil",
		"rawalpindi":"pakistan",
		"cleveland":"etats-unis",
		"pyongyang":"coree du nord",
		"dakar":"senegal",
		"cali":"colombie",
		"tachkent":"ouzbekistan",
		"denver":"etats-unis",
		"daegu":"coree du sud",
		"ekurhuleni":"afrique du sud",
		"hefei":"chine",
		"maracaibo":"venezuela",
		"changchun":"chine",
		"shijiazhuang":"chine",
		"budapest":"hongrie",
		"tshwane": "afrique du sud",
		"pretoria - capitale administrative": "afrique du sud",
		"jaipur":"inde",
		"hambourg":"allemagne",
		"orlando":"etats-unis",
		"tangshan":"chine",
		"portland or":"etats-unis",
		"varsovie":"pologne",
		"lusaka":"zambie",
		"lucknow":"inde",
		"asuncion":"paraguay",
		"mashhad":"iran",
		"urumqi":"chine",
		"tampa - saint-petersburg":"etats-unis",
		"bruxelles":"belgique",
		"sanaa":"yemen",
		"puebla": "mexique",
		"heroica puebla de zaragoza": "mexique",
		"copenhague":"danemark",
		"saint-louis":"etats-unis",
		"faisalabad":"pakistan",
		"taiyuan":"chine",
		"cebu":"philippines",
		"birmingham": "royaume-uni",
		"west midlands": "royaume-uni",
		"lisbonne":"portugal",
		"patna":"inde",
		"bursa":"turquie",
		"dalian":"chine",
		"zibo":"chine",
		"munich":"allemagne",
		"douala":"cameroun",
		"yaounde":"cameroun",
		"manchester":"royaume-uni",
		"mossoul":"irak",
		"vienne":"autriche",
		"katowice":"pologne",
		"stuttgart":"allemagne",
		"pittsburgh":"etats-unis",
		"antananarivo":"madagascar",
		"tunis":"tunisie",
		"ouagadougou":"burkina faso",
		"kunming":"chine",
		"sapporo":"japon",
		"nagpur":"inde",
		"campinas":"bresil",
		"charlotte":"etats-unis",
		"benin":"nigeria",
		"harare":"zimbabwe",
		"sacramento":"etats-unis",
		"gujranwala":"pakistan",
		"san jose":"costa rica",
		"valence":"espagne",
		"yinchuan":"chine",
		"qingdao":"chine",
		"changsha":"chine",
		"katmandou":"nepal",
		"davao":"philippines",
		"belem":"bresil",
		"vancouver":"canada",
		"phnom penh":"cambodge",
		"san juan":"porto rico",
		"guiyang":"chine",
		"salt lake city":"etats-unis",
		"surakarta":"indonesie",
		"san salvador":"salvador",
		"santa cruz de la sierra":"bolivie",
		"amsterdam":"pays-bas",
		"kansas city":"etats-unis",
		"columbus oh":"etats-unis",
		"brownsville - mcallen - matamoros - reynosa":"etats-unis",
		"dammam":"arabie saoudite",
		"nanchang":"chine",
		"bucarest":"roumanie",
		"yogyakarta":"indonesie",
		"san antonio":"etats-unis",
		"el paso - ciudad juarez":"etats-unis",
		"indianapolis":"etats-unis",
		"barranquilla":"colombie",
		"cirebon":"indonesie",
		"la paz": "bolivie",
		"capitale administrative": "bolivie",
		"las vegas":"etats-unis",
		"bakou":"azerbaidjan",
		"anshan":"chine",
		"palembang":"indonesie",
		"kumasi":"ghana",
		"malang":"indonesie",
		"conakry":"guinee",
		"port harcourt":"nigeria",
		"xinyang":"chine",
		"george town":"malaisie",
		"leeds": "royaume-uni",
		"west yorkshire": "royaume-uni",
		"turin": "italie",
		"torino": "italie",
		"rotterdam":"pays-bas",
		"zhengzhou":"chine",
		"brisbane":"australie",
		"managua":"nicaragua",
		"lyon":"france",
		"goiania":"bresil",
		"stockholm":"suede",
		"prague":"tchequie",
		"ujung pandang": "indonesie",
		"macassar": "indonesie",
		"antalya":"turquie",
		"cincinnati":"etats-unis",
		"alma":"pays-bas",
		"kaduna":"nigeria",
		"indore":"inde",
		"adana":"turquie",
		"quito":"equateur",
		"coimbatore":"inde",
		"toluca":"mexique",
		"rabat":"maroc",
		"la havane":"cuba",
		"kochi":"inde",
		"raleigh - durham":"etats-unis",
		"konya":"turquie",
		"haiphong": "viet nam",
		"hải phong": "viet nam",
		"mbuji-mayi":"republique democratique du congo",
		"lubumbashi":"republique democratique du congo",
		"oshogbo":"nigeria",
		"mirat": "inde",
		"meerut": "inde",
		"doha":"qatar",
		"tripoli":"libye",
		"maputo":"mozambique",
		"beyrouth":"liban",
		"milwaukee":"etats-unis",
		"daejon":"coree du sud",
		"mandalay":"myanmar (birmanie)",
		"kozhikode":"inde",
		"perth":"australie",
		"jilin":"chine",
		"austin":"etats-unis",
		"manaus":"bresil",
		"la mecque":"arabie saoudite",
		"newcastle upon tyne": "royaume-uni",
		"north east": "royaume-uni",
		"nashville":"etats-unis",
		"montevideo":"uruguay",
		"brabant":"pays-bas",
		"seville":"espagne",
		"abou dabi":"emirats arabes unis",
		"minsk":"bielorussie (belarus)",
		"lanzhou":"chine",
		"santos":"bresil",
		"huambo":"angola",
		"n'djamena":"tchad",
		"gaziantep":"turquie",
		"tainan":"taiwan",
		"bhopal":"inde",
		"hiroshima":"japon",
		"gaza":"palestine",
		"kampala":"ouganda",
		"belgrade":"serbie",
		"thrissur":"inde",
		"alicante-elche":"espagne",
		"sanliurfa":"turquie",
		"nashik":"inde",
		"virginia beach - norfolk":"etats-unis",
		"valence": "venezuela",
		"valencia": "venezuela",
		"vadodara":"inde",
		"dublin":"irlande",
		"glasgow":"royaume-uni",
		"denpasar":"indonesie",
		"dandong-sinŭiju": "chine",
		"chine - coree du nord": "chine",
		"leon":"mexique",
		"rongcheng":"chine",
		"zhanjiang":"chine",
		"sendai":"japon",
		"agra":"inde",
		"alep":"syrie",
		"aba":"nigeria",
		"marseille - aix-en-provence":"france",
		"kharkiv": "ukraine",
		"kharkov": "ukraine",
		"porto":"portugal",
		"vishakhapatnam":"inde",
		"mersin":"turquie",
		"cracovie":"pologne",
		"vitoria":"bresil",
		"lome":"togo",
		"kocaeli":"turquie",
		"brazzaville":"congo",
		"maracay":"venezuela",
		"onitsha":"nigeria",
		"ludhiana":"inde",
		"malappuram":"inde",
		"gwangju":"coree du sud",
		"thiruvananthapuram":"inde",
		"sofia":"bulgarie",
		"nanning":"chine",
		"bhubaneswar":"inde",
		"tabriz":"iran",
		"luoyang":"chine",
		"xuzhou":"chine",
		"mogadiscio":"somalie",
		"kannur":"inde",
		"greensboro - winston-salem":"etats-unis",
		"diyarbakir":"turquie",
		"donetsk":"ukraine",
		"shizuoka":"japon",
		"malaga-marbella":"espagne",
		"goteborg":"suede",
		"auckland":"nouvelle-zelande",
		"multan":"pakistan",
		"cần thơ":"viet nam",
		"helsinki":"finlande",
		"novossibirsk":"russie",
		"fuzhou":"chine",
		"jacksonville":"etats-unis",
		"abuja":"nigeria",
		"florence": "italie",
		"firenze": "italie",
		"almaty":"kazakhstan",
		"baotou":"chine",
		"liverpool":"royaume-uni",
		"changwon-masan":"coree du sud",
		"oslo":"norvege",
		"asmara":"erythree",
		"hatay":"turquie",
		"cordoba":"argentine",
		"ulsan":"coree du sud",
		"san pedro sula":"honduras",
		"varanasi": "inde",
		"benares": "inde",
		"rajkot":"inde",
		"cardiff":"royaume-uni",
		"louisville":"etats-unis",
		"panama":"panama",
		"erevan":"armenie",
		"nouvelle-orleans":"etats-unis",
		"carthagene des indes": "colombie",
		"cartagena de indias": "colombie",
		"vijayawada":"inde",
		"hartford":"etats-unis",
		"bandar lampung":"indonesie",
		"huainan":"chine",
		"kisangani":"republique democratique du congo",
		"madurai":"inde",
		"dnipro": "ukraine",
		"dniepropetrovsk": "ukraine",
		"cotonou":"benin",
		"iekaterinbourg":"russie",
		"zhangjiakou":"chine",
		"calgary":"canada",
		"peshawar":"pakistan",
		"barquisimeto":"venezuela",
		"khulna":"bangladesh",
		"grand rapids":"etats-unis",
		"niamey":"niger",
		"oklahoma city":"etats-unis",
		"łodź":"pologne",
		"greenville - spartanburg":"etats-unis",
		"handan":"chine",
		"sao luis":"bresil",
		"pingxiang":"chine",
		"qiqihar":"chine",
		"oulan-bator":"mongolie",
		"macao": "chine",
		"aomen": "chine",
		"mannheim":"allemagne",
		"datong":"chine",
		"cagayan de oro":"philippines",
		"sheffield":"royaume-uni",
		"medine":"arabie saoudite",
		"memphis":"etats-unis",
		"manisa":"turquie",
		"edmonton":"canada",
		"leipzig-halle":"allemagne",
		"cucuta":"colombie",
		"edimbourg":"royaume-uni",
		"manama":"bahrein",
		"oran":"algerie",
		"natal":"bresil",
		"jamshedpur":"inde",
		"batam":"indonesie",
		"cochabamba":"bolivie",
		"ogbomosho":"nigeria",
		"ottawa - gatineau":"canada",
		"marrakech":"maroc",
		"dresde":"allemagne",
		"ningbo":"chine",
		"kayseri":"turquie",
		"nuremberg":"allemagne",
		"birmingham":"etats-unis",
		"asansol":"inde",
		"zurich":"suisse",
		"tbilissi":"georgie",
		"okayama":"japon",
		"adelaide":"australie",
		"freetown":"sierra leone",
		"jerusalem":"israel",
		"jerusalem est": "palestine",
		"quartier de jerusalem": "palestine",
		"toulouse":"france",
		"rosario":"argentine",
		"johor bahru":"malaisie",
		"shiraz":"iran",
		"bengbu":"chine",
		"bucaramanga":"colombie",
		"srinagar":"inde",
		"wenzhou":"chine",
		"allahabad":"inde",
		"palerme": "italie",
		"palermo": "italie",
		"richmond":"etats-unis",
		"jabalpur":"inde",
		"samsun":"turquie",
		"benghazi":"libye",
		"nijni novgorod":"russie",
		"mataram":"indonesie",
		"brescia":"italie",
		"bari":"italie",
		"nelson mandela bay": "afrique du sud",
		"port elizabeth": "afrique du sud",
		"monrovia":"liberia",
		"harrisburg":"etats-unis",
		"zagreb":"croatie",
		"hama":"syrie",
		"bobo-dioulasso":"burkina faso",
		"hamamatsu":"japon",
		"tegal":"indonesie",
		"mombasa":"kenya",
		"maisuru":"inde",
		"baoding":"chine",
		"poznań":"pologne",
		"chemnitz-zwickau":"allemagne",
		"hofuf":"arabie saoudite",
		"kananga":"republique democratique du congo",
		"kazan":"russie",
		"la laguna - torreon":"mexique",
		"kitwe":"zambie",
		"buffalo":"etats-unis",
		"irbid":"jordanie",
		"maceio":"bresil",
		"dhanbad":"inde",
		"amritsar":"inde",
		"tegucigalpa":"honduras",
		"aurangabad":"inde",
		"tcheliabinsk":"russie",
		"mascate":"oman",
		"balikesir":"turquie",
		"kingston":"jamaique",
		"maiduguri":"nigeria",
		"bordeaux":"france",
		"omsk":"russie",
		"hohhot":"chine",
		"benxi":"chine",
		"lille": "france",
		"partie francaise": "france",
		"rochester":"etats-unis",
		"albany":"etats-unis",
		"samara":"russie",
		"albuquerque":"etats-unis",
		"xianyang":"chine",
		"wrocław":"pologne",
		"teresina":"bresil",
		"naypyidaw":"myanmar (birmanie)",
		"bielefeld":"allemagne",
		"daqing":"chine",
		"ilorin":"nigeria",
		"tulsa":"etats-unis",
		"fes":"maroc",
		"nottingham": "royaume-uni",
		"east midlands": "royaume-uni",
		"bangui":"republique centrafricaine",
		"hanovre":"allemagne",
		"bilbao":"espagne",
		"agadir":"maroc",
		"jodhpur":"inde",
		"taef":"arabie saoudite",
		"angeles":"philippines",
		"kigali":"rwanda",
		"valparaiso":"chili",
		"fresno":"etats-unis",
		"sholapur":"inde",
		"anvers":"belgique",
		"concepcion":"chili",
		"ranchi":"inde",
		"ostrava":"tchequie",
		"raipur":"inde",
		"rostov-sur-le-don":"russie",
		"bristol":"royaume-uni",
		"catane": "italie",
		"catania": "italie",
		"oufa":"russie",
		"kollam":"inde",
		"banjul":"gambie",
		"knoxville":"etats-unis",
		"bhilai":"inde",
		"thessalonique":"grece",
		"gwalior":"inde",
		"damiette":"egypte",
		"gdańsk":"pologne",
		"queretaro":"mexique",
		"erbil":"kurdistan",
		"san-luis potosi":"mexique",
		"kahramanmaras":"turquie",
		"van":"turquie",
		"joao pessoa":"bresil",
		"kolwezi":"republique democratique du congo",
		"dayton":"etats-unis",
		"changzhou":"chine",
		"abeokuta":"nigeria",
		"haifa":"israel",
		"qom":"iran",
		"ahvaz":"iran",
		"zhenjiang":"chine",
		"krasnoiarsk":"russie",
		"tanger":"maroc",
		"pointe-noire":"congo",
		"cape coral - fort myers - naples":"etats-unis",
		"tucson":"etats-unis",
		"la haye": "pays-bas",
		"s-gravenhage": "pays-bas",
		"taian":"chine",
		"douchanbe":"tadjikistan",
		"liuzhou":"chine",
		"đa nẵng":"viet nam",
		"aydin":"turquie",
		"perm":"russie",
		"guwahati":"inde",
		"samarinda":"indonesie",
		"chandigarh":"inde",
		"voronej":"russie",
		"huaibei":"chine",
		"tiruchirapalli":"inde",
		"volgograd":"russie",
		"kozhikkod":"inde",
		"warri":"nigeria",
		"nouakchott":"mauritanie",
		"odessa":"ukraine",
		"bologne": "italie",
		"bologna": "italie",
		"nice":"france",
		"mendoza":"argentine",
		"kota":"inde",
		"honolulu":"etats-unis",
		"aden":"yemen",
		"sao jose dos campos":"bresil",
		"hsinchu":"taiwan",
		"lilongwe":"malawi",
		"padang":"indonesie",
		"sarasota - bradenton - north port":"etats-unis",
		"breme":"allemagne",
		"merida":"mexique",
		"libreville":"gabon",
		"aracaju":"bresil",
		"chiang mai":"thailande",
		"geneve":"suisse",
		"mexicali":"mexique",
		"ribeirao preto":"bresil",
		"omaha":"etats-unis"
	};

	return countries[city];

}

module.exports.parse = parse;
