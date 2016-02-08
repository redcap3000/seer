counter = undefined;
genC3Chart = function(){
  if(typeof chart2 != "undefined"){
    // regen chart....
    counter = undefined;
   
    chart2 = chart2.destroy();
    //load data from crossfilter??
  }else{
	 document.write('<div class="chart1"></div><div class="chart2"></div>');
	 //theData = crossfilter([{}]);
  }

  console.log('Init C3 Chart');
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 1000) - 40;
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight  || 940) - 100;
  // to do...
 
  var c3Col = generateColumns(keyMapping);

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
          y: {
            tick : { 
              format: d3.format(',.1f'),
	             count : 2,
              culling : {
                max : 2
              }
            }
          }
        },
      legend: { show: true },
      interaction: {
        enabled: false
      }
  });

}

vMatrix = {};
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
		oldLength = c3StoreY.length;
	}else{

		if(oldLength == c3StoreY.length){
			console.log("no new values");
			return false;
		}
	}
	var columns = [];
        
  columns.push(c3StoreX);
	
  for(var key in c3StoreY){
      columns.push(c3StoreY[key]);
      if(typeof vMatrix[key] == "undefined"){
        vMatrix[key] = c3StoreY[key].length;
      }else{
        if(c3StoreY[key].length !== vMatrix[key]){
          // we have more records!!
          var diff =  c3StoreY[key].length - vMatrix[key];
          if(diff > 1){
            console.log("High volitility: " + key + " " + diff);
          }
          // do some other processing...
          var newVal = c3StoreY[key][c3StoreY[key].length-1];
          var valBefore = c3StoreY[key][c3StoreY[key].length-2];
          var diff = newVal - valBefore;
          diff = diff.toFixed(4);
          // make sure that the new diff isn't the abs of the old diff ... hmmm
          if(Math.abs(diff) > .50){
            console.log(key + " : " + diff);
          }
          vMatrix[key] = c3StoreY[key].length;
        }
      }
  }
  if(columns.length > 0){
          chart2.load({columns:columns});

  } 
  return true;},100);
});
