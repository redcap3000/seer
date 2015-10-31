btcHigh = function(keyName){
 if(typeof keyName == "undefined"){
	keyName = 'Bitfinex';
  }
  var comp;
    chart2.data(keyName)[0].values.filter(function(a,i){
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
};

btcLow = function(keyName){
  if(typeof keyName == "undefined"){
	keyName = 'Bitfinex';
  }
  var comp;
    chart2.data(keyName)[0].values.filter(function(a,i){
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
};

getBtcPrice = function(time,keyName){
  if(typeof keyName == "undefined"){
	keyName = 'Bitfinex';
  }
  // link the x axis to the bfBtcAxis ; find the time ; use index
  // to reference
    var index = chart2.xs()[keyName];

    if(typeof index != "undefined" ){
      index = index.indexOf(time);
      
      if(index != -1){
        return chart2.data('Bitfinex')[0].values[index].value;
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

oldVal = {};
flowChart = function(columnX,columnY){
  if(typeof chart2 != "undefined"){
    var keyName = columnY[0];
    var d3Color;
    oldVal[keyName] = columnY[1];
    chart2.flow({
      columns : [
        columnX,
        columnY
      ],
      length : 0
    });
    var keyName = columnY[0];
    var nameUdate = {};
    nameUdate[keyName] = columnY[1].toFixed(2) + '\t' + columnY[0];
    
    var dataColors = {};
    var dataColorValue = 
    dataColors[keyName] = d3Color;
    chart2.data.names(nameUdate);
    chart2.data.colors(d3Color);
    // update color of graph if higher than previous lighter, if not darker		
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
