// Variables for x, axis; javascript date objects
// btcDiffX relates to x axis labels indexed by date
//x = ['x'], ltcX = ['x1'] , btcDiffX = ['x']; 
// Variables for y axis; numbers/floats
bfBtcAxis = ['bfbtc'], ltAxis = ['ltc'], btcDiffAxis = ['btcDiff'];

document.write('<div class="chart2"></div><br/><button onclick="chart2.transform(\'step\')">Step</button><button onclick="chart2.transform(\'line\')">Line</button>');

// maybe take an object
// column equals 
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
loadChart = function(x,ltcX,bfBtcAxis,ltAxis){
  if(typeof chart2 != "undefined" && chart2 && chart2 != null){
    return chart2.load({columns : [ x,ltcX,bfBtcAxis,ltAxis] });
  }else{
    console.log("missing this chart");
    return false;
  }
};


// build chart; charts two x axes as a timeseries
if(typeof chart2 == "undefined"){
  console.log('Init C3 Chart');
  chart2 = c3.generate({
      bindto:'.chart2',
      size: { height: 300 , width: 1260 },
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
            axes : {
              'bfbtc' : 'y2',
              //'ltc' : 'y'
             },
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
          },
          y2: { show:true }
        },
      legend: { show: true },
      interaction: {
        enabled: false
      }
  });
}
