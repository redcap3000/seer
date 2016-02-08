

btcTimeDiff = function(time,pastTime){
  // returns seconds maybe rewrite this to just do subtraction on 
  // unix timestamp ?
  return ((time.getTime() / 1000) - (pastTime.getTime() / 1000));
}


/*
  C3 utilities

*/

oldVal = {};

c3StoreY = {};

c3StoreY1 = {};

c3StoreX = ['x'];

c3StoreX1 = ['x'];



flowChart = function(columnX,columnY){
  if(typeof chart2 != "undefined"){
    var keyName = columnY[0],
    keyName = columnY[0],
    nameUdate = {},
    nameUdate2 = {},
    lastTime = false;

    if(typeof c3StoreY[keyName] == "undefined"){
      c3StoreY[keyName] = [keyName];
    }
    if(c3StoreX.length > 1){
      var lastTime = c3StoreX[c3StoreX.length -1];
    }

    if(c3StoreY[keyName].length > 3){
      var look = c3StoreY[keyName][c3StoreY[keyName].length-1];
      var look = parseFloat(look);
      
      var oldOldValue = c3StoreY[keyName][c3StoreY[keyName].length-2];
      var diff = (oldOldValue - look).toFixed(2);
      if(diff && !isNaN(diff) && diff != ''){
         if(typeof c3StoreY1[keyName] == "undefined"){
            c3StoreY1[keyName] = [keyName];
          }
          c3StoreX1.push(columnX[1]);
          if(Math.abs(diff) > .10){
            c3StoreY1[keyName].push(parseFloat(diff).toFixed(2));
            // update
          }else{
            // use previous diff
            c3StoreY1[keyName].push(0);
            diff = false;
          }
      }
    }else{
      oldOldValue = false;
    }
    if(lastTime && lastTime.getTime() == columnX[1].getTime()){
      //console.log('already have this value');
      ;
    }else{
      c3StoreX.push(columnX[1]);
    }
    var oldValue = c3StoreY[keyName];
    // add new value 
    c3StoreY[keyName].push(columnY[1]);

          //  a = (diff ? '\u2193' : '\u2297');
          //}
          // compare new value stored to all others

          //nameUdate[key] =  a  + TAB + (diff && !isNaN(diff) ? ' ' + Math.abs(diff).toFixed(2) + TAB : "");
          //nameUdate2[key] = a + TAB + look.toFixed(2);

        //}
      //}
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
