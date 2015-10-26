// Variables for x, axis; javascript date objects
// btcDiffX relates to x axis labels indexed by date
//x = ['x'], ltcX = ['x1'] , btcDiffX = ['x']; 
// Variables for y axis; numbers/floats
//<br/><button onclick="chart2.transform(\'step\')">Step</button><button onclick="chart2.transform(\'line\')">Line</button><button onclick="flushAll()">Flush</button><button onclick="flushAll(60 * 30)">AutoFlush</button>

document.write('<div class="chart2"></div>');

// maybe take an object
// column equals 



flushAll = function(){
  chart2.ygrids.remove();
  chart2.regions.remove();
  chart2.xgrids.remove()
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

// probably depreciate... or modify


// build chart; charts two x axes as a timeseries
if(typeof chart2 == "undefined"){
  console.log('Init C3 Chart');
  chart2 = c3.generate({
      transition : { duration : 0 },
      oninit : function(){
        console.log('chart generation init');

        bitcoinSub = Meteor.subscribe("ticker_bitcoin",
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
                  // load differece data on fourth added value to speed up inital load time on slow azz devices
                  if(dataLength == 5){
                    diffSub = Meteor.subscribe("ticker_differenceData",
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
                    });
                  }
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
            
            // maybe remove this to window on changed event c3...
            chart2.resize();
          }
        );

      },
      bindto:'.chart2',
      size: { height: 700 , width: 1024 },
      data: {
            type:  'step',
            xs :{
              'bfbtc' : 'x',
              //'ltc' : 'x1'
            },
            columns: [ 
              ['x'], 
              //['x1'], 
              ['bfbtc'], 
              //['ltc'] 
            ],
           
            axis : {
              x : {
                label : { position: 'inner-center' }
              }
            },
            xFormat : '%I:%M:%S',
            }

            ,
      color: {
            pattern: ['white', 'yellow', 'orange']
          },
      axis: {
          x: {
            type: 'timeseries',
            tick: { format: '%I:%M:%S' }
          },
          y: {
            tick : { format: d3.format("$,") }
          }
        },
      legend: { show: false },
      interaction: {
        enabled: false
      }
  });
}
