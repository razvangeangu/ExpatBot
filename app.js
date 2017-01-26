var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bot = require('./chatbot.js');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));

// Add headers
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://ec2-52-56-124-99.eu-west-2.compute.amazonaws.com:80');

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

app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', socket => {
  username = socket.handshake.query.username;
  console.log(`${username} connected`);

  socket.on('client:message', data => {
    console.log(`${data.username}: ${data.message}`);

    // message received from client, now broadcast it to everyone else
    //parse(data.message, function(result) {
//		io.emit('server:message', result);
//	});

	// demo
	if (data.message.match("ambassade")) {
		io.emit('server:message', {bot: true, body: [{type: 'title', content: "l'ambassade d'allemagne est "}, {type: 'text', content: 'Pariser Platz 5, 10117 Berlin, Allemagne'}]});
	} else if (data.message.match("consulat")) {
		io.emit('server:message', {bot: true, body: [{type: 'title', content: "les consulats en Allemagne sont a "}, {type: 'text', content: 'Dusseldorf, Francfort, Hambourg, Munich, Sarrebruck, Stuttgart'}]});
	} else {
		
		io.emit('server:message', {bot: true, body: [{type: 'title', content: "Oops"}, {type: 'text', content: "Pardon je n'ai pas compris votre recherche"}]});
}

  });

  socket.on('disconnect', () => {
    //console.log(`${username} disconnected`);
  });
});

function parse(message, callback) {
	//console.log('Bot: ' + JSON.stringify(bot.parse(message)));
	//return bot.parse(message);
	bot.parse(message, function(result) {
		console.log('Bot: ' + JSON.stringify(result));
		callback(result);
	});
}

http.listen(80, function(){
  console.log('listening on *:80');
});
