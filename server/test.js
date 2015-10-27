btcPastPrice = 0;
//ltcPastPrice = 0;
//ltcDiff = 0, 
btcDiff = 0;
//ltcPastDiff = 0, 
btcPastDiff = 0;

bsbtcPastPrice = 0;

Meteor.startup(function(){
	Pusher = Meteor.npmRequire('pusher-client');
	var pusher = new Pusher('de504dc5763aeef9ff52');
	var trades_channel = pusher.subscribe('live_trades');
	var i = 0;
	trades_channel.bind('trade', Meteor.bindEnvironment(function(data) {
		if(data['price'] != bsbtcPastPrice){
		    var time =  Math.round(new Date() / 1000,2);
		    Bitfinex.set('bs_' + time, parseFloat(data['price']));
	    	console.log( ' bitstamp : ' + data['amount'] + ' BTC @ ' + data['price'] + ' USD');
	    	bsbtcPastPrice = data['price'];
		}
	}));

	Meteor.setInterval(
		function(){
			console.log(new Date());
			RunCli.run("redis-cli flushall");
		},
	1000*60*10);
	Meteor.setInterval(function(){
		var time =  Math.round(new Date() / 1000,2);
		var ltcPrice = bitfinex_ticker('ltcusd','last_price');
		var btcPrice = bitfinex_ticker('btcusd','last_price');
		if(btcPrice && btcPrice != btcPastPrice){
			var btcDiff = btcPrice - btcPastPrice;
			Bitfinex.set('bb_'+time,parseFloat(btcPrice).toFixed(2));
			btcPastPrice = btcPrice;
			if(btcPastDiff != btcDiff && Math.abs(btcDiff) > .25){
				console.log('BTC\t: ' + 
							btcDiff.toFixed(2) + 
							'\t\t\t: ' + 
							btcPastPrice + 
							'\t* '+
							btcPastDiff.toFixed(2));
				Bitfinex.set('bdd_' + time,btcPastDiff - btcDiff);
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


Meteor.methods ({
	'flushRedis' : function(){
		console.log('flush all');
		RunCli.run("redis-cli flushall")
	}
});
