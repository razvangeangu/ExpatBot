var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var sha1 = require('sha1');
var exec = require('exec');
var morgan = require('morgan');


app.use(express.static(path.join(__dirname, 'public')));

// Add headers
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	// res.setHeader('Access-Control-Allow-Origin', 'http://ec2-52-56-124-99.eu-west-2.compute.amazonaws.com:80');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/static/index.html');
});

app.get('/api', function(req, res){
	res.send("<h1>Welcome to this amazing API!</h1>");
});

app.get('/api/test', function(req, res) {
	res.send("<h1>Hello, " + req  + "<h1>");
});

var server = app.listen(80, function() {
	console.log('Server listening on port 80');
});

server.timeout = 5 * 60000;
