getResponseData = function(url,field){
  var response = HTTP.get(url);
  if(response && typeof response.data != "undefined" && response.data && response.data != null){
    if(typeof field != "undefined" && field && field != null){
      if(typeof response.data[field] != "undefined"){
        return response.data[field];
      }else{
        return false;
      }
    }
    return response.data;
  }
  return false;
};



bitfinex_symbols = function(){
  return getResponseData("https://api.bitfinex.com/v1/symbols");
};

bitfinex_ticker = function(symbol,field,asFloat){
  symbol = (typeof symbol == "undefined" || !symbol || symbol == null ? 'btcusd' : symbol);
  if(typeof field == "string" && asFloat == true){
    var response = getResponseData("https://api.bitfinex.com/v1/pubticker/" + symbol,field);
    return (response ? parseFloat(response) : false);
  }
  return getResponseData("https://api.bitfinex.com/v1/pubticker/" + symbol,field);
}

btcAverage = function(callback){
var btcaverage = Meteor.npmRequire('btcaverage');
      btcaverage()
          .then(Meteor.bindEnvironment(callback));
};