/**
 * Init
 */
var OAuth       = require('oauth').OAuth;
var querystring = require('querystring');
var config 		= require('./config');

var socketclient = require('socket.io-client'); // to connect to our server



// server waar rest op draait (zelfde machine):
clientio = socketclient.connect('http://localhost', {port: 3000});


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













