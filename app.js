var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
var https = require('https');

app.use(express.static(__dirname + '/public'));

app.post('/riot', function(request, response) {

  var name = request.body.summonerName;

	var body = "";
	var profile;

	var riotAPI = https.get("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=3cfc7c5c-611d-4fc6-9154-7801d822e7cb", function(riotResponse){


		riotResponse.on('data', function(chunk){
			body += chunk;
			//console.log(body);
			profile = body;

			response.type('json');
  			response.end(profile);

		});

	});

});

app.set('port', (process.env.PORT || 5000));