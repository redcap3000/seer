
Meteor.publish('ticker_differenceData', function(){
	return Bitfinex.matching("bdd_*");
});

Meteor.publish('ticker_bitcoin', function(){
        return Bitfinex.matching("bb_*");
});

Meteor.publish('ticker_litecoin', function(){
	return Bitfinex.matching('lu_*');
});
