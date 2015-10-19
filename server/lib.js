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

bitcoin_average_com = function(){
  var url = 'https://api.bitcoinaverage.com/ticker/USD/';
  var response = getResponseData(url,'last');
  if(response){
    return parseFloat(response);
  }else{
    console.log('bitcoinaverage.com returned no data');
  }
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

coinbase_sell_price = function() {
  var response = getResponseData("https://coinbase.com/api/v1/prices/sell",'subtotal');
  if(response && typeof response.amount != "undefined"){
        return parseFloat(response.amount);
  }else{
        console.log("Problem with coinbase sell price request");
        return false;
  }
};