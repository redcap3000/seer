// Variables for x, axis; javascript date objects
// btcDiffX relates to x axis labels indexed by date
//x = ['x'], ltcX = ['x1'] , btcDiffX = ['x']; 
// Variables for y axis; numbers/floats

document.write('<div class="chart2"></div><br/><button onclick="chart2.transform(\'step\')">Step</button><button onclick="chart2.transform(\'line\')">Line</button><button onclick="flushAll()">Flush</button><button onclick="flushAll(60 * 30)">AutoFlush</button>');

// maybe take an object
// column equals 



flushAll = function(){
  chart2.ygrids.remove();
                //chart2.ygrids.remove({class :"btcHigh"});
  chart2.unload({
  ids: ['x', 'bfbtc']
  });
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
