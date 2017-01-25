var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var expat = require('./expat.js');

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

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', socket => {
  username = socket.handshake.query.username;
  console.log(`${username} connected`);

  socket.on('client:message', data => {
    console.log(`${data.username}: ${data.message}`);

    // message received from client, now broadcast it to everyone else
    socket.broadcast.emit('server:message', resolve(data.message));
  });

  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
  });
});

function resolve(message) {
	var response = '';
	
	if (message.match('code for Pakistan?')) {
		expat.getId('Pakistan', function(result) {
			response = result;
		});
	}

	console.log('Bot: ' + response);
	return response;
}

http.listen(80, function(){
  console.log('listening on *:80');
});
