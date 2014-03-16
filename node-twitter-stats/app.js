/**
 * Init
 */
var httpreq 	= require('httpreq');
var OAuth       = require('oauth').OAuth;
var querystring = require('querystring');
var config 		= require('./config');
var util 		= require('util');
var async 		= require('async');
var cheerio 	= require('cheerio');
var _ 			= require('underscore');
var express 	= require('express');
var http 		= require('http')
var path 		= require('path');
var socketio 	= require('socket.io');
var socketclient = require('socket.io-client'); // to connect to our server

var app = express();

var debugtest = false;

// Client Socket (speciaal om met onze mixmini te verbinden):
clientio = socketclient.connect('http://10.100.1.156', {port: 3000});

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('123456789987654321'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
io.set('log level', 0); // geen socket.io debug info, thx!

// authentication for other twitter requests
var twitterOAuth = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	config.twitter.consumerKey,
	config.twitter.consumerSecret,
	"1.0",
	null,
	"HMAC-SHA1"
);

var count = [];
var countpercent = [];

// Begin met pictures te zoeken:
init();

function init(){
	startSearchHose();
	startSendTwitterStats();
}


function startSearchHose(){
	// 2.) Luister ook naar nieuwe pictures die binnenkomen:
	var parameters = querystring.stringify({
		track: config.app.searchterms.join(',')
	});
	config.app.searchterms.forEach(function(entry){
		count.push(0);
		countpercent.push(0);
	});
	var twitterhose = twitterOAuth.get('https://stream.twitter.com/1.1/statuses/filter.json?' + parameters, config.twitter.token, config.twitter.secret);
	twitterhose.addListener('response', function (res){
		console.log("searchhose started");
		res.setEncoding('utf8');
		res.addListener('data', function (chunk){
			try{
				var tweet = JSON.parse(chunk);
				//console.log(tweet.text);
				index = 0;
				config.app.searchterms.forEach(function(entry){
					//console.log(index);
					if (tweet.text.search(entry) != -1){
						count[index] += 1;
					}
					index += 1;
				//console.log(count);
				});
			}catch(err){}
		});

		res.addListener('end', function(){
			console.log("Twitterhose broke down");
		});
	});
	twitterhose.end();
}

var tagindex = 0;

function startSendTwitterStats(){
	clientio.emit('join','scherm');
	function calculatePercents(){
		divider = 1;
		count.forEach(function(entry){
			if (entry > divider){
				divider = entry;
			}
		});
		countpercent = [];
		count.forEach(function(entry){
			countpercent.push(Math.round(entry*100/divider));
		});
		clientio.emit('twitter',{tag:config.app.searchterms[tagindex],count:countpercent[tagindex]});
		tagindex = (tagindex + 1)%countpercent.length;
		console.log(Date.now())
		console.log(tagindex)
	}

	(function loop() {
    var rand = Math.round(Math.random() * (8000 - 3000)) + 3000;
    setTimeout(function() {
            calculatePercents();
            loop();  
    }, rand);
	}());
}













