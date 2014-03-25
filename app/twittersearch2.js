// THIS ONE SEARCHES FOR COMPLETE TWEETS ABOUT A CERTAIN TAG


var OAuth       = require('oauth').OAuth;
var querystring = require('querystring');
var config 		= require('./config');

var updateCallback = null;

exports.onUpdate = function (callback) {
	updateCallback = callback;
};

// authentication for other twitter requests
var twitterOAuth = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	config.twitter.key,
	config.twitter.secret,
	"1.0",
	null,
	"HMAC-SHA1"
);

var count = [];
var countpercent = [];


startSearchHose();


function startSearchHose(){
	// 2.) Luister ook naar nieuwe pictures die binnenkomen:
	var parameters = querystring.stringify({
		track: config.app.searchterms.join(',')
	});
	config.app.searchterms.forEach(function(entry){
		count.push(0);
		countpercent.push(0);
	});
	var twitterhose = twitterOAuth.get('https://stream.twitter.com/1.1/statuses/filter.json?' + parameters, config.twitter.usertokens.token, config.twitter.usertokens.secret);
	twitterhose.addListener('response', function (res){
		console.log("searchhose started");
		res.setEncoding('utf8');
		res.addListener('data', function (chunk){
			try{
				var tweet = JSON.parse(chunk);

				if(updateCallback){
					updateCallback({tag:tweet.text,count:100});
				}
			}catch(err){}
		});

		res.addListener('end', function(){
			console.log("Twitterhose broke down");
		});
	});
	twitterhose.end();
}

var tagindex = 0;






