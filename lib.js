var getResponseData = function(url,field){
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
var bitcoin_average_com = function(){
  var url = 'https://api.bitcoinaverage.com/ticker/USD/';
  var response = getResponseData(url,'last');
  if(response){
    return parseFloat(response);
  }else{
    console.log('bitcoinaverage.com returned no data');
  }
};

var bitfinex_symbols = function(){
        return getResponseData("https://api.bitfinex.com/v1/symbols");
};

var bitfinex_ticker = function(symbol,field,asFloat){
        if(typeof symbol == "undefined" || !symbol || symbol == null){
                symbol = 'btcusd';
        }
        if(bitfinexSymbols.indexOf(symbol) > -1){
                if(typeof field == "string" && asFloat == true){
                        var response = getResponseData("https://api.bitfinex.com/v1/pubticker/" + symbol,field);
                        if(response){
                                return parseFloat(response);
                        }else{
                                return false;
                        }
                }
                return getResponseData("https://api.bitfinex.com/v1/pubticker/" + symbol,field);
        }else{
                console.log(symbol + '\t : not supported');
                console.log('\t ** Supported symbols **');
                console.log(bitfinexSymbols);
        }
        return false;
}

var coinbase_sell_price = function() {
  var response = getResponseData("https://coinbase.com/api/v1/prices/sell",'subtotal');
  if(response && typeof response.amount != "undefined"){
        return parseFloat(response.amount);
  }else{
        console.log("Problem with coinbase sell price request");
        return false;
  }

};
