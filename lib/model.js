//var Schemas = {};
//CoinbaseApi = new Meteor.Collection("coinbase_api");

redisKeyToTime = function(id){
	id = id.split('_');
	return parseInt(id[1]);
};

Bitfinex = new Meteor.RedisCollection("redis");

/*Bitfinex.allow({
  exec: function (userId, command, args) {
    return true;
  }
});*/


keyMapping = {
	"Bitfinex" : 'bb',
	'Btc-e' : 'aBe',
	'OKCoin' : 'aOk',
	'CoinBase' : 'aCb'
};

// store via api key
//Ticker = new Meteor.Collection("ticker");
