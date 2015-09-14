var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var favicon = require('serve-favicon');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.post('/riot', function(request, response) {

  var name = request.body.summonerName;

	var riotAPI = https.get("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=36ca80ba-ff5b-4fa4-bdfd-39b2d92f7d29", function(riotResponse){
		var body = "";
		riotResponse.on('data', function(chunk){
			body += chunk;
		});
		riotResponse.on('end', function(){
			response.type('json');
			response.end(body);		
		});	
	});

});

app.post('/match', function(request, response) {

  var id = request.body.summonerID;

  var url = "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + id + "?beginIndex=0&endIndex=10&api_key=36ca80ba-ff5b-4fa4-bdfd-39b2d92f7d29";


	var riotAPI = https.get(url, function(riotResponse){
		var body = "";
		riotResponse.on('data', function(chunk){
			body += chunk;
		});
		riotResponse.on('end', function(){
			response.type('json');
			response.end(body);		
		});	
	});

});


app.get('/result/:id', function(request, response) {


	var matchID = request.params.id;

  	var url = "https://na.api.pvp.net/api/lol/na/v2.2/match/" + matchID + "?api_key=00aba4b6-7d40-4dfd-b023-d0449210ff14";

  	console.log(url);

	var riotAPI = https.get(url, function(riotResponse){
		var body = "";
		riotResponse.on('data', function(chunk){
			body += chunk;
		});

		riotResponse.on('end', function(){
			response.type('json');
			response.end(body);		
		});	
	});

});

app.post('/map', function(request, response) {

  var url = "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?dataById=true&api_key=36ca80ba-ff5b-4fa4-bdfd-39b2d92f7d29"

	var riotAPI = https.get(url, function(riotResponse){
		var body = "";
		riotResponse.on('data', function(chunk){
			body += chunk;
		});

		riotResponse.on('end', function(){
			response.type('json');
			response.end(body);		
		});	
	});

});

/*
var pg = require('pg');
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})
*/