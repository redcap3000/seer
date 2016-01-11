
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
