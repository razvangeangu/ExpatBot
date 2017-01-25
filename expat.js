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
			if(response[item]["nom"].match(countryName)) { 
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
	var alert = []; 
	return getData("http://diplomatie.gouv.fr/fr/mobile/json_full/flux-cav-json-dernieres-minutes.json", function(response) {
		for(var item in response) { 
			if(response[item]["iso2"].match(idCountry)) { 
				alert.push(response[item]); 
			}
		} 
	callback(alert); 
	}); 
}

module.exports.getId = getId;
module.exports.getCoordinates = getCoordinates;
module.exports.getConsulat = getConsulat;
module.exports.getEmbassy = getEmbassy;
module.exports.getFlag = getFlag;
module.exports.getName = getName;
module.exports.getCountryDetails = getCountryDetails; 
module.exports.getAlerts = getAlerts; 
module.exports.getCheckAlert = getCheckAlert; 
