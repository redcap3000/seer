btcHigh = function(){
  var comp;
  if(typeof chart2 != "undefined" && chart2.data()[0] != "undefined"){
    chart2.data()[0].values.filter(function(a,i){
      a = a.value;
      if(i == 1){
        comp = a;
      }else if(i != 0){
        if(a > comp){
          comp = a;
        }
      }
    });
    return comp;
  }
  return false;
};

btcLow = function(){
  var comp;
  if(typeof chart2.data()[0] != "undefined"){
    chart2.data()[0].values.filter(function(a,i){
      a = a.value;
      if(i == 1){
        comp = a;
      }else if(i != 0){
        if(a < comp){
          comp = a;
        }
      }
    });
    return comp;
  }
};

getBtcPrice = function(time){
  // link the x axis to the bfBtcAxis ; find the time ; use index
  // to reference
  var index = chart2.xs().bfbtc.indexOf(time);
  if(index != -1 && typeof chart2.data()[0] != "undefined"){
    return chart2.data()[0].values[index].value;
  }
  return false;
};

btcTimeDiff = function(time,pastTime){
  // returns seconds maybe rewrite this to just do subtraction on 
  // unix timestamp ?
  return ((time.getTime() / 1000) - (pastTime.getTime() / 1000));
}