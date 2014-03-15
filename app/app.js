#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var socketio = require('socket.io');
var socketclient = require('socket.io-client'); // to connect to our server
var utils = require('./utils');
var midimapping = require('./midimapping');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('hexamusic123456789987654321'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var webserver = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function (req, res){
	res.render('index', { title: 'Hexamusic' });
});

app.get('/boe', function (req, res){

	console.log( req.query.test );


	res.send(200);
});

// (server) Socket IO
var io = socketio.listen(webserver);
io.set('log level', 0);


// Client Socket (speciaal om met onze mixmini te verbinden):
clientio = socketclient.connect('mixmini.mixlab.be', {port: 3000});

clientio.on('connect', function () {
	console.log("socket connected to mixmini.mixlab.be");
});

clientio.on('midi', function (rawmidiMessage) {
	var readableMessage = midimapping.parseMessage(rawmidiMessage);

	//console.log(rawmidiMessage);
	//console.log(readableMessage);
//	console.log("midi received!");

	io.sockets.emit('midi', rawmidiMessage);
	color='#'+Math.floor(Math.random()*16777215).toString(16);
	io.sockets.emit('ctrl', {bgcolor: color});
	io.sockets.emit('admin', {token: 1}); 
	io.sockets.in('app').emit('alert', {'alert': 'alert'}); 

	paansturing(rawmidiMessage,color);
//	if(readableMessage.channel == 0)
//	{
//		io.sockets.emit('midi', rawmidiMessage);
//		color='#'+Math.floor(Math.random()*16777215).toString(16);
//		io.sockets.emit('ctrl', {bgcolor: color});
//	};
});

io.sockets.on('connection', function (socket) {
	socket.on('join',function(room) {
		socket.join(room);
		console.log("Joined "+room);
	});

	socket.on('color', function(data) {
		io.sockets.emit('ctrl', {bgcolor: data.my});
		console.log(data);
	});
});


function paansturing(rMsg)
{
	console.log("projectie emit!");
	// SetScaleX
	// SetScaleY
	// SetScaleZ
	// SetSpacingX
	// SetSpacingY
	// SetCubesX
	// setCubesY
	// SetColor
	io.sockets.emit('projectie',{projectie: [rMsg[0],rMsg[0],rMsg[0],rMsg[0],rMsg[0],rMsg[0],rMsg[0],color]});
}
function sendSomeCrazySocketEvent(){
	io.sockets.emit('ctrl', {color: '#FFFFFF'});
}



