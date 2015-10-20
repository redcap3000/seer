Meteor.startup(function () {
//  
  Meteor.subscribe("ticker_bitcoin",
    function(){
      // begin
      Bitfinex.matching("bb_*").
      observeChanges({
        added : function(id,doc){
          var time = new Date(redisKeyToTime(id) * 1000);
          var value = parseFloat(doc.value);
          var btcPrice = parseFloat(doc.value);
          x.push(time);
          //var diff = btcPrice - bfBtcAxis[bfBtcAxis.length - 1];
          chart2.axis.labels({y2:value.toFixed(4),position:"middle"});
          // check high/low value? update various labels accordingly?
          // check is new high is new low...
          // draw some x axises...
          // can't reliably use 'getBtcPrice' because that may return multiple values...
          // hmm....
          if(bfBtcAxis.length > 6){
            if(value > btcHigh()){
              var line = {axis:"y2", value : value, class: "btcHigh", position:"start"};
              if(typeof oldHigh != "undefined"){
                // calculate time diff
                line.text = btcTimeDiff(time,oldHigh) + 's ' + getBtcPrice(oldHigh);
                chart2.ygrids.remove({value: getBtcPrice(oldHigh)});

              }
              // issue removing ygrids by class ignores proper styling

              chart2.ygrids.add([
                line
              ]);
              oldHigh = time;
            }else if(value < btcLow()){
              var line = {axis:"y2",value : value, class: "btcLow",position:"start"};
              if(typeof oldLow != "undefined"){
                line.text = btcTimeDiff(time,oldLow) + 's ' + getBtcPrice(oldLow);
                chart2.ygrids.remove({value: getBtcPrice(oldLow)});
              }
              chart2.ygrids.add([
                line
              ]);
              oldLow = time;
            }
          }
          bfBtcAxis.push(value);
          loadChart();	
        }
      });
      // get & observe difference data 
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
                    // these lines are white .... i think ? 

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
                    // create a region based on the last value in x  and latest...
                      chart2.regions.add(
                        {axis: 'x',start: pastTime,end : time, opacity:parsedValue/2,class: 'regionX'}
                      );
                      var diff = btcTimeDiff();
                      if(diff > 10){
                        gridLine.text =  diff;
                      }

                    }
                  }
                  // attempt to hide labels if values are too similar
                  
                  oldVal = value;
                  pastTime = time;
                  

                  chart2.xgrids.add([gridLine]);
                }
              }
            );
          Meteor.subscribe("ticker_litecoin",
            function(){
              Bitfinex.matching("lu_*").
              observeChanges({
                added : function(id,doc){
                  var time = new Date(redisKeyToTime(id) * 1000);
                  ltcX.push(time);
                  ltAxis.push(parseFloat(doc.value));
                  loadChart();
                }
              }
            );
          }
          );
        }
      );

    }
  );
chart2.resize();
});