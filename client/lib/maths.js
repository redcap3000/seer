
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

c3StoreY = {};

c3StoreY1 = {};

c3StoreX = ['x'];

c3StoreX1 = ['x'];



flowChart = function(columnX,columnY){
  if(typeof chart2 != "undefined"){
    var keyName = columnY[0];
    //var d3Color;
    //oldVal[keyName] = columnY[1];
    //chart2.flow({
    //  columns : [
    //    columnX,
    //    columnY
    //  ],
    //  length : 0
    //});
    var keyName = columnY[0];
    var nameUdate = {};
    var nameUdate2 = {};

    //nameUdate[keyName] = '*' + columnY[1].toFixed(2) + '\t' + columnY[0];
    // change all other keynames to NOT be '*'
 
    // do some basic stat data... show + if price went up minus if it went down?
    //keyGrouping = [];
    
    if(typeof c3StoreY[keyName] == "undefined"){
      c3StoreY[keyName] = [keyName];
    }
    // for diff data 
   
    // time
    // check last value to see if its close enough to current value?
    if(c3StoreX.length > 1){
      var lastTime = c3StoreX[c3StoreX.length -1];
    }else{
      lastTime = false;
    }

    //console.log(c3StoreY[keyName].length);
    //console.log(keyName);
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
      console.log('already have this value');
    }else{
      c3StoreX.push(columnX[1]);
    }
    //[c3StoreY[key].length-1]
    var oldValue = c3StoreY[keyName];
    // add new value 
    c3StoreY[keyName].push(columnY[1]);

    // next load ALL data? or just the one that changed... hmmmm
    // iteriate through keys in c3Store
    var columns = [];
    // for difference data...
    var columns1 = [];
    // add 'x time column' eventually search for time to avoid adding too many dots to thesame time?
    columns.push(c3StoreX);
    columns1.push(c3StoreX1);

    for(var key in c3StoreY){
      // build keygrouping for c3StoreY1 dynamically?
      //keyGrouping.push(key);
      //var a = '';

     
      //if(key == keyName){
        // used to determine if val is higher/lower could also be used to 
        // determine the highest moving market

        //if(oldValue[oldValue.length-2] < columnY[1]){
          //&uArr;;
        //  a = '\u21D1\t';
        //}else{
          //&dArr;
        //  a = '\u21D3\t';
        //}
        // if theres a difference ONLY show that ....
        // 
        //nameUdate[key] =  a + TAB + (diff && !isNaN(diff) ? ' ' + ' ' + Math.abs(diff).toFixed(2) + TAB: ""); 
        //nameUdate2[key] = a + TAB + columnY[1];

      //}else{
        //var diff = false;
        //if(key != 'x' && key != keyName){      
          //var look = c3StoreY[key][c3StoreY[key].length-1];
          //var look = parseFloat(look);

          // minus one because it will be the latest, unlike the value the key is called upon which will 
          // i think i'm doing this this way because this value won't be passed into the called function
      
          // to do use another icon to determine "NEW HIGH" and "NEW LOW"
          //if(look > columnY[1]){
            // swap out to show 'minor changes'
            // &oplus;
          //  a = (diff ? '\u2191' : '\u2295');
          //}else{
          //  a = (diff ? '\u2193' : '\u2297');
          //}
          // compare new value stored to all others

          //nameUdate[key] =  a  + TAB + (diff && !isNaN(diff) ? ' ' + Math.abs(diff).toFixed(2) + TAB : "");
          //nameUdate2[key] = a + TAB + look.toFixed(2);

        //}
      //}
      columns.push(c3StoreY[key]);
      //console.log(c3StoreY[key]);
      if(typeof c3StoreY1[key] != "undefined"){
        columns1.push(c3StoreY1[key]);
      }
      // console.log(c3StoreY1[key]);
      
    }

    // push diff column
    //chart1.data.names(nameUdate);

    //chart2.data.names(nameUdate2);

    //(columns);
    if(columns.length > 0){
      chart2.load({columns : columns});
    }
    if(columns1.length > 0){
       chart1.load({columns : columns1})
    }
    // change class name based on old value.. plus minus...
    // var dataColors = {};
    // var dataColorValue = 
    //dataColors[keyName] = d3Color;
    
    //chart2.data.colors(d3Color);
    //if(typeof counter == "undefined"){
    //	     counter = 1;
    //}else{
    //	     counter += 1;
    //}
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
