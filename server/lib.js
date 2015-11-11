
setRedis = function(key,time,value){
  Bitfinex.set(key + '_'+ time,parseFloat(value).toFixed(2));
  // set for 'ticker only' collection
  setTickerVal(key,parseFloat(value).toFixed(2));
  return;
};

setTickerVal = function(tickerName,value){
  Bitfinex.set('t_'+tickerName,parseFloat(value).toFixed(2));
  return;
};

/* 
  Using kinda cool btc average plugin
*/
btcAverage = function(callback){
var btcaverage = Meteor.npmRequire('btcaverage');
      btcaverage()
          .then(Meteor.bindEnvironment(callback));
};


/*
  Default flow for what to do with the average data (store to redis)
  btcAverage(btcAverageCallback);
*/

btcAverageCallback = function(priceDetails){
  if(typeof valArray == "undefined"){
    valArray = [];
  }
  var time =  Math.round(new Date() / 1000,2);
  Object.keys(priceDetails.prices).map(function(providerName){
    var value = parseFloat(priceDetails.prices[providerName]).toFixed(2);
//    console.log(providerName + ':\t$\t' + priceDetails.prices[providerName]);
    if(typeof keyMapping[providerName] != "undefined" && value != 0.00){
      //console.log(providerName + ':\t$\t' + priceDetails.prices[providerName]);

      if(typeof valArray[providerName] == "undefined"){
          valArray[providerName] = value;
          setRedis(keyMapping[providerName],time,value);
        }else if(valArray[providerName] !== value ){
          setRedis(keyMapping[providerName],time,value);
          var btcDiff = (value - valArray[providerName]).toFixed(2);
          // store difference data for bitfinex ...
      	  if(typeof btcPastDiff != "undefined" && btcPastDiff != btcDiff && Math.abs(btcDiff) > .4){
       	 	console.log('BTC\t: ' + 
              	btcDiff.toFixed(2) + 
              	'\t\t\t: ' + 
             	btcPastPrice + 
              	'\t* '+
              	btcPastDiff.toFixed(2));
           //	setRedis('bdd',time,btcPastDiff - btcDiff);
      	  }else if(btcPastDiff == "undefined"){
        	var btcPastDiff = btcDiff;
          }
      	  btcPastDiff = btcDiff;
        }
        valArray[providerName] = value;
    }
  });
 };
