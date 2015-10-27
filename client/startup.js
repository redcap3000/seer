
genC3Chart = function(){
  if(typeof chart2 != "undefined"){
    // regen chart....
    if(typeof bitcoinSub != "undefined")
      bitcoinSub.stop();
    if(typeof averagesSub != "undefined")
      averagesSub.stop();
    if(typeof bitstampSub != "undefined")
      bitstampSub.stop();
    if(typeof diffSub != "undefined"){
	  diffSub.stop();
    }
    chart2 = chart2.destroy();

  }

  console.log('Init C3 Chart');
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 1000) - 40;
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight  || 740) - 100;
  // to do...
 
  var c3Col = generateColumns(keyMapping);
  // add bitstamp; we're using a pusher websocket to update this value , so its not in keyMapping
  c3Col[0].push(['Bitstamp']);
  c3Col[1]['Bitstamp'] = 'x';

  chart2 = c3.generate({
      transition : { duration : 0 },
      padding : {
        top : 10,
      },
      onresized : function(){
        chart2.resize();
      },
      oninit : function(){
        console.log('chart generation init');

        bitcoinSub = Meteor.subscribe("ticker_bitcoin",
          function(){
            // begin
            bitstampSub = Meteor.subscribe("ticker_bitstamp",
              function(id,doc){
                Bitfinex.matching("bs_*").
                  observeChanges({
                    added: function (id, doc) {
                      // ...
                      var time = new Date(redisKeyToTime(id) * 1000);
                      var value = parseFloat(doc.value);
                      flowChart(['x',time],['Bitstamp',value]);
                    }
                  });
              });
            averagesSub = Meteor.subscribe('ticker_averages',function(){
              Bitfinex.matching("a*").
                observeChanges({
                  added : function(id,doc){
                    //console.log(id);
                    var key = id.split('_');
                    if(key.length > 1){
                      var l = reverseLookup(key[0]);
                      if(l){
                        key = l;
                      }else{
                        return false;
                      }

                    }
                    if(typeof key != "undefined" && key && key != ''){

                      var time = new Date(redisKeyToTime(id) * 1000);
                      var value = parseFloat(doc.value);
                      // do a key map eventually
                      flowChart(['x',time],[key,value]);
                    }
                    // switch up the key
                  }
                });
            });
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
                              //if(doc.value.indexOf('-') === 0){
                              //  gridLine.class = 'lNeg';
                              //  var parsedValue = Math.abs(value);

                              //}else{
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
                                    {axis: 'x',start: pastTime,end : time, opacity:parsedValue/3,class: 'sell'}
                                  );
                                  if(parsedValue > .6 && parsedValue < 2){
                                    region.class = 'sell';
                                    // quick hack to avoid 'initalization' values that are the price of btc
                                  }
                                  var diff = btcTimeDiff(time,pastTime);
                                  if(diff > 10){
                                    gridLine.text =  (diff > 120 ? (diff/60).toFixed(2) + 'm' : diff + 's');
                                    chart2.xgrids.add([gridLine]);
                                  }
                                  chart2.regions.add(region);
                                }
                                
                              //}
                              // attempt to hide labels if values are too similar
                              oldVal = value;
                              pastTime = time;
                            }
                          }
                        );
                        // bitstamp data.... sub to it.. 
                       
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
                flowChart(['x',time],['Bitfinex',value]);
              }
            });
            // chained sub
            
            // maybe remove this to window on changed event c3...
            
          }
        );

      },
      bindto:'.chart2',
      size: { height: h , width: w },
      data: {
            type:  'scatter',
            xs :c3Col[1],
            columns: c3Col[0],
            //groups : [
            //  ['bfbtc','Bitstamp']
            //],
           //axes :{
           //   'bfbtc' : 'y',
           //   'Bitstamp' : 'y2'
           //},
            axis : {
              x : {
                label : { position: 'inner-center' }
              }
            },
            xFormat : '%I:%M',
            }

            ,
      color: {
            pattern: ['#FFFF33', '#FF33FF', '#99CCFF',"orange","green"]
          },
      axis: {
          x: {
            type: 'timeseries',
            tick: { 
              format: '%I:%M',
              culling : {
                max : 4
              }
            }
          },
          //x2 : {
          //  type: 'timeseries',
          //  tick: { format: '%I:%M' }
          //},
          y: {
            tick : { 
              format: d3.format('$,.2f'),
              culling : {
                max : 4
              }
            }
          }
          //y2 : {
          //  show : false,
          //  tick : { 
          //    format: d3.format('$,.2f') 
          //  }
          //}
        },
      legend: { show: true },
      interaction: {
        enabled: false
      }
  });

}

Meteor.startup(function(){


	genC3Chart();
});