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
        chart1.resize();
      },
      oninit : function(){
        console.log('chart1 generation init');
      },
            bindto:'.chart1',
      size: { height: 300 , width: w },
      data: {
            type:  'step',
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
            //groups: [keyGrouping]
      },
      grid : {
          x : {
            show : true,
          },
          y : {
            show : true,
            lines : [{value:0}]
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
        legend: { show: true, position : 'bottom' },
        interaction: {
          enabled: false
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
        if(typeof ticker_only == "undefined")
        ticker_only = Meteor.subscribe("ticker_only",
          function(){
            console.log("client sub");
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
      size: { height: 700 , width: w },
      data: {
            type:  'step',
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
              format: '%I',
              count : 2,
              culling : {
                max : 2
              }
            }
          },
          //x2 : {
          //  type: 'timeseries',
          //  tick: { format: '%I:%M' }
          //},
          y: {
            tick : { 
              format: d3.format(',.1f'),
	             count : 2,
              culling : {
                max : 2
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
  var style = document.createElement('style');
  // start the 'update' process
  // update every .... 500 ms? less 100 ms?
  style.type = 'text/css';
  style.innerHTML = 'body{background-color:black;}.tick text {display:none} .c3-legend-item text { fill:white ;stroke: none; }.c3-axis-y2-label{fill:black;stroke:black;}';
  // I have NO idea why my css file is not serving so forced to do this....
  document.getElementsByTagName('head')[0].appendChild(style);
  Meteor.setInterval(     
	function(){
	if(typeof oldLength == "undefined"){
		// dont update the chart if everything is the same length (nothing added)
		oldLength = c3StoreX.length;
	}else{

		if(oldLength == c3StoreX.length){
			console.log("no new values");
			return false;
		}
	}
	if(typeof c3StoreX == "undefined" || typeof c3StoreX1 == "undefined" || typeof c3StoreY == "undefined"){
		return false;
	}
	var columns = [];
        var columns1 = [];
        
	columns.push(c3StoreX);
        columns1.push(c3StoreX1);
	
        for(var key in c3StoreY){
                columns.push(c3StoreY[key]);
                if(typeof c3StoreY1[key] != "undefined"){
                        columns1.push(c3StoreY1[key]);
                }
        }
        if(columns.length > 0){
                chart2.load({columns:columns});
        }
        if(columns1.length > 0){
                chart1.load({columns:columns1});
        }
        return true;},200);
});
