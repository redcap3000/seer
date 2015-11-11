Meteor.startup(function(){
	Pusher = Meteor.npmRequire('pusher-client');
	var pusher = new Pusher('de504dc5763aeef9ff52');
	var trades_channel = pusher.subscribe('live_trades');
	var BitstampPastPrice = 0;
	trades_channel.bind('trade', Meteor.bindEnvironment(function(data) {
		var price = parseFloat(data['price']).toFixed(2);
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
	1000*60*2);
	Meteor.setInterval(function(){
		var time =  Math.round(new Date() / 1000,2);
		btcAverage(btcAverageCallback);
	},
	2000);
});

