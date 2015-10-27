btcHigh = function(){
  var comp;
  if(typeof chart2 != "undefined" && chart2.data()[0] != "undefined" && typeof chart2.data()[0].values != "undefined" && chart2.data()[0].values.length > 1){
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
  if(typeof chart2.data()[0] != "undefined"  && typeof chart2.data()[0].values != "undefined" && chart2.data()[0].values.length > 1){
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
  if(typeof chart2.data()[0] != "undefined" && typeof chart2.data()[0].values != "undefined" && chart2.data()[0].values.length > 1){
    var index = chart2.xs().Bitfinex;

    if(typeof index != "undefined" ){
      index = index.indexOf(time);
      
      if(index != -1){
        return chart2.data()[0].values[index].value;
      }
    }
  }
  return false;
};

btcTimeDiff = function(time,pastTime){
  // returns seconds maybe rewrite this to just do subtraction on 
  // unix timestamp ?
  return ((time.getTime() / 1000) - (pastTime.getTime() / 1000));
}


/*
  C3 utilities

*/

flushAll = function(){
  if(typeof chart2 != "undefined"){
    chart2.ygrids.remove();
    chart2.regions.remove();
    chart2.xgrids.remove();
    chart2.unload();
  }
  if(typeof bitcoinSub != "undefined"){
    bitcoinSub.stop();
  }
  if(typeof bitstampSub != "undefined"){

  }
  if(typeof diffSub != "undefined"){

  }
};

flowChart = function(columnX,columnY){
  if(typeof chart2 != "undefined"){
    chart2.flow({
      columns : [
        columnX,
        columnY
      ],
      length : 0

    });
    return true;
  }
  return false;
};

reverseLookup = function(keyValue){
  var theProperty = undefined;
  if(typeof keyMapping != "undefined"){
     for (var property in keyMapping) {
        if (keyMapping.hasOwnProperty(property)) {
            // do stuff
            if(keyMapping[property] == keyValue){
              theProperty = property;
            }
        }
    }
  }
  if(typeof theProperty != "undefined"){
    return theProperty;
  }
  return false;
}
generateColumns = function(keyObj){
  if(typeof keyObj == "undefined"){
    return false;
  }
  var columns = [];
  var xs = {};
  for (var property in keyObj) {
      if (keyObj.hasOwnProperty(property)) {
          // do stuff
          columns.push([property]);
          xs[property] = 'x';
      }
  }
  return [columns,xs];
};