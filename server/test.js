btcPastPrice = 0;
//ltcPastPrice = 0;
//ltcDiff = 0, 
btcDiff = 0;
//ltcPastDiff = 0, 
btcPastDiff = 0;

BitstampPastPrice = 0;


var setRedis = function(key,time,value){
	Bitfinex.set(key + '_'+ time,parseFloat(value).toFixed(2));
};


btcAverageCallback = function(priceDetails){
	if(typeof valArray == "undefined"){
		valArray = [];
	}
	/*

			Btc-e: $284.21
I20151026-20:16:32.823(-8)? CoinDesk: $287.9464
I20151026-20:16:32.823(-8)? CoinBase: $0
I20151026-20:16:32.823(-8)? BitStamp: $288.84
I20151026-20:16:32.823(-8)? BlockChain: $288.09
I20151026-20:16:32.824(-8)? OKCoin: $288.62
I20151026-20:16:32.824(-8)? Bitfinex: $288.8
I20151026-20:16:32.824(-8)? HitBTC: $304.25
I20151026-20:16:32.824(-8)? CoinTrader: $0
I20151026-20:16:32.824(-8)? LoyalBit: $291.42
I20151026-20:16:32.824(-8)? Bitex.la: $289.58323485
I20151026-20:16:32.824(-8)? RockTrading: $290.79
	*/

	  var time =  Math.round(new Date() / 1000,2);

	  Object.keys(priceDetails.prices).map(function(providerName){
	  	var value = parseFloat(priceDetails.prices[providerName]).toFixed(2);
	      console.log(providerName + ':\t$\t' + priceDetails.prices[providerName]);
	      if(typeof keyMapping[providerName] != "undefined" && value != 0.00){

			  if(typeof valArray[providerName] == "undefined"){
	          	valArray[providerName] = value;
	         	setRedis(keyMapping[providerName],time,value);
	          }else if(valArray[providerName] !== value ){
	          	setRedis(keyMapping[providerName],time,value);
	          }
	          valArray[providerName] = value;
	      }
	     
	  });
              //console.log('---- Average ----$' + parseFloat(priceDetails.average).toFixed(2));
          };

Meteor.startup(function(){
	Pusher = Meteor.npmRequire('pusher-client');
	var pusher = new Pusher('de504dc5763aeef9ff52');
	var trades_channel = pusher.subscribe('live_trades');
	var i = 0;
	trades_channel.bind('trade', Meteor.bindEnvironment(function(data) {
		var price = parseFloat(data['price']);

		if(price && price != BitstampPastPrice){
		    var time =  Math.round(new Date() / 1000,2);
		    setRedis('bs' , time, data['price']);
	    	//console.log( ' bitstamp : ' + data['amount'] + ' BTC @ ' + data['price'] + ' USD');
	    	BitstampPastPrice = price;
		}
	}));

	Meteor.setInterval(
		function(){
			console.log(new Date());
			RunCli.run("redis-cli flushall");


		},
	1000*60*4);
	Meteor.setInterval(function(){
		var time =  Math.round(new Date() / 1000,2);
		var ltcPrice = bitfinex_ticker('ltcusd','last_price');
		var btcPrice = bitfinex_ticker('btcusd','last_price');
		btcAverage(btcAverageCallback);
		if(btcPrice && btcPrice != btcPastPrice){
		
			var btcDiff = btcPrice - btcPastPrice;
			setRedis('bb',time,btcPrice);

			btcPastPrice = btcPrice;
			if(btcPastDiff != btcDiff && Math.abs(btcDiff) > .5){
				console.log('BTC\t: ' + 
							btcDiff.toFixed(2) + 
							'\t\t\t: ' + 
							btcPastPrice + 
							'\t* '+
							btcPastDiff.toFixed(2));
				setRedis('bdd',time,btcPastDiff - btcDiff);
			}
			btcPastDiff = btcDiff;
		}

		//if(ltcPrice && ltcPastPrice !== ltcPrice){
			//var ltcDiff = ltcPrice - ltcPastPrice;
			// double check if returned quote is string/number for rounding ... maybe use string pos; for reducing data sizes
			//Bitfinex.set('lu_' + time,parseFloat(ltcPrice).toFixed(2));
			//ltcPastPrice = ltcPrice;
			// only console log if the diff is .. hmm ?
			//if(Math.abs(ltcPastDiff) != Math.abs(ltcDiff) && ltcDiff > .0001){
				//console.log('LTC\t: '+ ltcDiff.toFixed(4) + '\t\t: ' + ltcPastPrice + '\t* ' + ltcPastDiff.toFixed(4));
			//	ltcPastDiff = ltcDiff;	
			//}
		//}	
	},
	1000);
});

