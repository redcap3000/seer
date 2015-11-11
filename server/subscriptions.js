
Meteor.publish('ticker_differenceData', function(){
	return Bitfinex.matching("bdd_*");
});

Meteor.publish('ticker_bitcoin', function(){
        return Bitfinex.matching("bb_*");
});

Meteor.publish('ticker_litecoin', function(){
	return Bitfinex.matching('lu_*');
});

// attempt to sub data using crossfilter ?

Meteor.publish("ticker_bitstamp", function(){
	return Bitfinex.matching('bs_*');
});

Meteor.publish("ticker_averages", function(){
	return Bitfinex.matching('a*');
});

// returns a sets of values that are updated not removed... 
Meteor.publish("ticker_only",function(){
	console.log('client subbed');
	return Bitfinex.matching('t_*');
})