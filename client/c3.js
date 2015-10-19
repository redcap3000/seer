// Variables for x, axis; javascript date objects
// btcDiffX relates to x axis labels indexed by date
x = ['x'], ltcX = ['x1'] , btcDiffX = ['x']; 
// Variables for y axis; numbers/floats
tAxis = ['btc'], bfBtcAxis = ['bfbtc'], ltAxis = ['ltc'], btcDiffAxis = ['btcDiff'];

document.write('<div class="chart2"></div><br/><button onclick="chart2.transform(\'step\')">Step</button><button onclick="chart2.transform(\'line\')">Line</button>');
// adding this iframe.. kinda cool... maybe implement the beta api
document.write('<iframe frameborder="0" width="100%" height="400" src="https://embed.cryptowat.ch/bitfinex/btcusd/1hr?theme=standard&config=external&locale=en" id="cw-embed-df2ee98277"></iframe>');
document.write('<script>document.getElementById("cw-embed-df2ee98277").onload = function() {this.contentWindow.postMessage({config:{"candleWidth":5,"candles":{"spacing":3},"depthZoomLevel":0.015,"indicators":{"ema":{"periods":[10,21,100,null,null],"show":true},"sma":{"periods":[15,50,null,null,null],"show":false},"sar":{"step":0.025,"maxStep":0.05,"show":true},"bollingerBands":{"show":false,"period":20,"stddevs":2},"keltnerChannel":{"show":false,"atrPeriod":14,"atrs":2},"volume":{"show":true,"height":90},"macd":{"show":true,"periods":[10,26],"lag":9,"height":150},"rsi":{"show":false,"periods":14,"height":100},"stochRSI":{"show":false,"periods":14,"maPeriods":5,"height":90},"obv":{"show":false,"maPeriods":21,"height":100},"aroon":{"show":false,"periods":25,"height":100},"ichimoku":{"show":false,"tenkanPeriod":9,"kijunPeriod":26},"chandelierExit":{"show":false,"periods":22,"atrs":1},"zigzag":{"show":false,"threshold":7}},"mouse":{"scrollX":true,"scrollY":true},"showTrades":true,"showOrders":true,"grid":false,"chartStyle":"OHLC","yAxis":"linear","yaxis":{"depth":true},"padding":{"price":25},"performance":{"animateFeeds":true,"frameRate":10},"drawing":{"snap":true,"snapThreshold":25,"extrapolate":false}}}, "https://embed.cryptowat.ch") };</script>');

loadChart = function(){
  if(typeof chart2 != "undefined" && chart2 && chart2 != null){
    return chart2.load({columns : [ x,ltcX,bfBtcAxis,ltAxis] });
  }else{
    console.log("missing this chart");
    return false;
  }
};

// build chart; charts two x axes as a timeseries
chart2 = c3.generate({
    bindto:'.chart2',
    size: { height: 400 , width: 1260 },
    data: {
          //type:  'step',
          xs :{
            'bfbtc' : 'x',
            'ltc' : 'x1'
          },
          columns: [ x, ltcX, bfBtcAxis, ltAxis ],
          axes : {
            'bfbtc' : 'y2',
            'ltc' : 'y'
           },
          axis : {
            x : {
              label : { position: 'inner-center' }
            }
          },
          xFormat : '%I:%M:%S',
          selection: { enabled: true }
          }

          ,
    color: {
          pattern: ['white', 'yellow', 'red']
        },
    axis: {
        x: {
          type: 'timeseries',
          tick: { format: '%I:%M:%S' }
        },
        y: {
          tick : { format: d3.format("$,") }
        },
        y2: { show:true }
      },
    legend: { show: true }
});

Meteor.startup(function () {
  chart2.resize();
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
          chart2.axis.labels({y2:btcPrice.toFixed(4)});
          bfBtcAxis.push(parseFloat(doc.value));
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
                    var parsedValue = value;
                    switch(parsedValue){
                      case parsedValue > .6:
                        gridLine.class = 'lPlus';
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
                        {axis: 'x', start: pastTime,end : time, opacity:parsedValue/2,class: 'regionX'}
                      );
                    }
                  }
                  // attempt to hide labels if values are too similar
                  if(parsedValue > .1 && value != oldVal){
                    gridLine.text = doc.value.slice(0,6);
                  }
                  oldVal = value;
                  pastTime = time;
                  chart2.xgrids.add([gridLine]);
                }
              }
            );
        }
      );

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
});