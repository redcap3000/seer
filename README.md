# seer
C3 based real time cryptocurrency charting.

##Dependencies
**Redis**

##Supported Markets
Bitfinex - LTC
Bitfinex - BTC


##How to use
Follow the instructions provided with slava:redis-livedata

##Whats going on
Aside from the obvious, the latest BTC price is listed on the y axis to the very left. High and low values are present, including the amount of time (in seconds) since the last last high or low.

Y axis lines refer to differences in prices. And for now follows this basic formula:
```
if(btcPastDiff != btcDiff && Math.abs(btcDiff) > .07)
```

When these conditions are met a record is created storing the value of the difference. This is then interpreted clientside. When a signfigant difference is encountered over a period of time it is colored in blue, with its opacity relating to the difference (usually negative). Red lines are negative differences while gray ones are positive.

The highs and lows are present as a line through the x axis, the first value is the number of seconds that elapsed between the current high/low, and the high/low before that; followed by the price.