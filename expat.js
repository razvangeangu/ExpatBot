function getData(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			return callback(JSON.parse(xhr.responseText));
		}
	}
	xhr.open('GET', url, true);
	xhr.send();
}

function getID(countryName, callback) { 
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