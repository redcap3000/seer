counter = undefined;
genC3Chart = function(){
  if(typeof chart2 != "undefined"){
    // regen chart....
    counter = undefined;
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
    //load data from crossfilter??
  }else{
	 document.write('<div class="chart1"></div><div class="chart2"></div>');
	 //theData = crossfilter([{}]);
  }

  console.log('Init C3 Chart');
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 1000) - 40;
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight  || 740) - 100;
  // to do...
 
  var c3Col = generateColumns(keyMapping);
  // add bitstamp; we're using a pusher websocket to update this value , so its not in keyMapping
  c3Col[0].push(['Bitstamp']);
  c3Col[1]['Bitstamp'] = 'x';
  chart1 = c3.generate({
      transition : { duration : 0 },
      padding : {
        top : 10,
      },
      onresized : function(){
        chart2.resize();
      },
      oninit : function(){
        console.log('chart1 generation init');
      },
            bindto:'.chart1',
      size: { height: h , width: w },
      data: {
            type:  'area-spline',
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
            xs :c3Col[1],
            columns: c3Col[0],
             groups: [keyGroups]
      },
      grid : {
          x : {
            show : true,
          },
          y : {
            show : true,
          } 
      },
      color: {
            pattern: ['#FFFF33', '#FF33FF', '#99CCFF',"orange","green","red","tan","purple","white","66FF66"]
          }

      
  });
  chart2 = c3.generate({
      transition : { duration : 0 },
      padding : {
        top : 10,
      },
      onresized : function(){
        chart2.resize();
      },
      oninit : function(){
        console.log('chart2 generation init');
        /*
        Meteor.subscribe("ticker_differenceData",
          function(){
            Bitfinex.matching("bdd_*").observeChanges({
                added : function(id,doc){
                  console.log('id\t' + id + "\t" + doc.value);
                }
              }
            );
          }
        );
        */
        Meteor.subscribe("ticker_only",
          function(){
            Bitfinex.matching("t_*").observeChanges({
                added : function(id,doc){
                    var key = id.split('_');
                    if(key.length > 1){
                      var l = reverseLookup(key[1]);
                      if(l){
                        key = l;
                      }else{
                        return false;
                      }
                    }
                    if(typeof key != "undefined" && key && key != ''){
                      var time = new Date();
                      var value = parseFloat(doc.value);
                      // do a key map eventually
                      //console.log({ time : time , value : value, type : key});
                      //theData.add([ { time : time , value : value, type : key} ]);
                      flowChart(['x',time],[key,value]);
                    }
                },
                changed : function(id,doc){
                    var key = id.split('_');
                    if(key.length > 1){
                      var l = reverseLookup(key[0]);
                      if(l){
                        key = l;
                      }else{
                        // try key[1]
                        l = reverseLookup(key[1]);
                        if(!l)
                          return false;
                        else
                          key = l;
                      }

                    }
                    if(typeof key != "undefined" && key && key != ''){
                      var time = new Date();
                      var value = parseFloat(doc.value);
                      // do a key map eventually
                      //theData.add([ { time : time , value : value, type : key} ]);
                      flowChart(['x',time],[key,value]);
                    }
                },
                updated : function(id,doc){
                  console.log('updated + ' + id +'\t' + doc.value);
                }
            });
        });
        

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
      },
      grid : {
        	x : {
        		show : true,
        	},
        	y : {
        		show : true,
        	}	
      },
      color: {
            pattern: ['#FFFF33', '#FF33FF', '#99CCFF',"orange","green","red","tan","purple","white","66FF66"]
          },
      axis: {
          x: {
            type: 'timeseries',
            tick: { 
              format: '%I:%M',
              count : 4,
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
	      count : 5,
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
      legend: { show: true, position : 'right' },
      interaction: {
        enabled: false
      }
  });

}

Meteor.startup(function(){
  genC3Chart();
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = 'body{background-color:gray;}';
  document.getElementsByTagName('head')[0].appendChild(style);
});
