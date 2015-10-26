btcPastPrice = 0;
//ltcPastPrice = 0;
//ltcDiff = 0, 
btcDiff = 0;
//ltcPastDiff = 0, 
btcPastDiff = 0;

Meteor.startup(function(){
	Meteor.setInterval(
		function(){
			console.log(new Date());
			RunCli.run("redis-cli flushall");
		},
	1000*60*2);
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
