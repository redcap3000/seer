

// maybe take an object
// column equals 

// probably depreciate... or modify


// build chart; charts two x axes as a timeseries
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
                      if(value != null){
			//theData.add([{ date : time , value : value, type : "Bitstamp" }]);
		       flowChart(['x',time],['Bitstamp',value]);
		      }else{
			console.log("listening to null values in bitstamp");
                      }
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
		      if(value != null){
		        theData.add([{ date : time , value : value, type : key }]);
                        flowChart(['x',time],[key,value]);
		      }else{
			console.log("value null in ticker_averages" + " " + doc.value);
                      }
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
		if(value != null){
	  	//	theData.add([{ date : time , value : value, type : "Bitfinex" }]);		
			flowChart(['x',time],['Bitfinex',value]);
		}
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
      tooltip: {
        show: false
        },
      color: {
            pattern: ['red', '#FF33FF', 'blue',"orange","green"]
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
      legend: { 
        show: true,
        position : "right"
      },
      interaction: {
        enabled: false
      }
  });

}
