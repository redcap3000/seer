btcHigh = function(){
  var comp;
  bfBtcAxis.filter(function(a,i){
    if(i == 1){
      comp = a;
    }else if(i != 0){
      if(a > comp){
        comp = a;
      }
    }
  });
  return comp;
};

btcLow = function(){
  var comp;
  bfBtcAxis.filter(function(a,i){
    if(i == 1){
      comp = a;
    }else if(i != 0){
      if(a < comp){
        comp = a;
      }
    }
  });
  return comp;
};

getBtcPrice = function(time){
  // link the x axis to the bfBtcAxis ; find the time ; use index
  // to reference
  var index = x.indexOf(time);
  if(index != -1){
    return bfBtcAxis[index];
  }
  return false;
};

btcTimeDiff = function(time,pastTime){
  // returns seconds
  return moment(time).diff(moment(pastTime)) / 1000;
}