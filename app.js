

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
var https = require('https');

var pg = require('pg');

var favicon = require('serve-favicon');



app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


app.post('/riot', function(request, response) {

  var name = request.body.summonerName;



	var riotAPI = https.get("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=3cfc7c5c-611d-4fc6-9154-7801d822e7cb", function(riotResponse){

		var body = "";
		
		riotResponse.on('data', function(chunk){

			body+= chunk;

		});

		riotResponse.on('end', function(){

			response.type('json');
			response.end(body);
			
		});
	


		});

});

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
