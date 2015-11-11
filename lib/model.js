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
	'CoinBase' : 'aCb',
//	'RockTrading' : 'aRt',
//	'HitBTC' : 'aHb',
//	'LoyalBit' : 'aLb',
	'Bitex.la' : 'aBt',
	'BlockChain' : 'aBc'
};
keyColors = {
	'Bitfinex' : 'red',
	'OkCoin' : 'lightblue',
 	'CoinBase' : 'orange',
	'BlockChain' : 'green',
	'Bitstamp' : 'yellow'
};
// store via api key
//Ticker = new Meteor.Collection("ticker");
