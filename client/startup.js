Meteor.startup(function () {
  initTime = new Date();
  
  autoFlush = function(duration){
    // accept duration in seconds
    if(typeof flushInterval != "undefined"){
      Meteor.clearInterval(flushInterval);
      }
    if(typeof duration == "number"){
        // set interval
      flushInterval = Meteor.setInterval(function(){flushAll()},duration * 1000);
    }
    return flushInterval;
  };

  

  Meteor.subscribe("ticker_bitcoin",
    function(){
      // begin

      Bitfinex.matching("bb_*").
      observeChanges({
        added : function(id,doc){
          var time = new Date(redisKeyToTime(id) * 1000);
          var value = parseFloat(doc.value);
          var btcPrice = parseFloat(doc.value);
          if(typeof oldHigh == "undefined"){
            chart2.axis.labels({y:value.toFixed(2),position:"middle"});
          }else{
            chart2.axis.labels({y:value.toFixed(2) + ' , ' + (value - getBtcPrice(oldHigh)).toFixed(2),position:"middle"});
          }
          var dataLength = (typeof chart2 != "undefined" && typeof chart2.data()[0] != "undefined" ? chart2.data()[0].values.length : 0);
          if( dataLength > 4){
            if(value > btcHigh()){
              // mark old high
              var line = {axis:"y", value : value, class: "btcHigh", position:"start"};
              if(typeof oldHigh != "undefined"){
                // calculate time diff
                line.value = getBtcPrice(oldHigh);
                line.text = btcTimeDiff(time,oldHigh) + 's ' + getBtcPrice(oldHigh);
                chart2.ygrids.remove({ class: "btcHigh"});

              }
              // issue removing ygrids by class ignores proper styling
              chart2.ygrids.add([
                line
              ]);
              oldHigh = time;
            }else if(value < btcLow()){
              var line = {axis:"y",value : value, class: "btcLow",position:"start"};
              if(typeof oldLow != "undefined"){
                var diff = btcTimeDiff(time,oldLow);
                line.value = getBtcPrice(oldLow);
                line.text = (diff > 120 ? (diff/60 ).toFixed(2) + 'm ' : diff + 's ') + getBtcPrice(oldLow);
                chart2.ygrids.remove({class :"btcLow"});
              }
              chart2.ygrids.add([
                line
              ]);
              oldLow = time;
            }
          }
          //bfBtcAxis.push(value);
          flowChart(['x',time],['bfbtc',value]);
        }
      });
      // chained sub
      Meteor.subscribe("ticker_differenceData",
            function(){
              oldVal = 0;
              Bitfinex.matching("bdd_*").
                observeChanges({
                  added : 
                    function(id,doc){
                      // add a x axis label index by time (of server computed difference data)
                      var time = new Date(redisKeyToTime(id) * 1000);
                      var value = parseFloat(doc.value);
                      var gridLine = {class : '',value : time};
                      if(doc.value.indexOf('-') === 0){
                        gridLine.class = 'lNeg';
                        var parsedValue = Math.abs(value);
                      }else{
                        var parsedValue = value;
                        switch(parsedValue){
                          case parsedValue > .6:
                            gridLine.class = 'lPlus';
                            gridLine.text = doc.value.slice(0,6);
                            // add xgrid
                          break;
                          case parsedValue < .4:
                            gridLine.class = 'lNeg';
                          break;
                        }
                        if(typeof pastTime == "undefined"){
                          // dont add a region...
                          pastTime = time;
                        }else{
                          var region = {axis: 'x',start: pastTime,end : time, opacity:parsedValue/3, class:'buy'};
                        // create a region based on the last value in x  and latest...
                          chart2.regions.add(
                            {axis: 'x',start: pastTime,end : time, opacity:parsedValue/2.5,class: 'sell'}
                          );
                          if(parsedValue > .6 && parsedValue < 2){
                            region.class = 'sell';
                            // quick hack to avoid 'initalization' values that are the price of btc
                          }
                          var diff = btcTimeDiff(time,pastTime);
                          if(diff > 10){
                            gridLine.text =  (diff > 120 ? (diff/60).toFixed(2) + 'm' : diff + 's');
                          }
                          chart2.regions.add(region);
                        }
                        chart2.xgrids.add([gridLine]);
                      }
                      // attempt to hide labels if values are too similar
                      
                      oldVal = value;
                      pastTime = time;
                     
                    }
                  }
                );
            }
          );
      // maybe remove this to window on changed event c3...
      chart2.resize();
    }
  );
});