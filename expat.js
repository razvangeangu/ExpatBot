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

function getVignette(idCountry, callback) {
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

module.exports.getId = getId;
