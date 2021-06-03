const TelegramBot = require('node-telegram-bot-api');
const token = 'YOUR BOT TOKEN HERE';
const bot = new TelegramBot(token, {interval: 100, timeout: 20, polling: true});
bot.on("polling_error", console.log);
const geckoAPI = 'https://api.coingecko.com/api/v3';
const axios = require('axios').default;
var nf = new Intl.NumberFormat();
const fs = require('fs-extra');
const ChartJsImage = require('chartjs-to-image');
const Chart = require('chart.js')
//const ChartFinancial = require('chartjs-chart-financial')

var cid;
var csymbol;
var coinsList;
var cprice;
var tdata;

bot.getMe().then(function (me) {
    botuname = me.username;
});

async function loadCoins() {
    axios.get(geckoAPI + '/coins/list')
    .then(function (response) {
      coinsList = response.data;
    })

}

loadCoins();
setTimeout(function(){
  loadCoins();
},24*60*60*60);

// function purgeChart(){
// fs.unlink('mychart.png', (err) => {
//     if (err) {
//         throw err;
//     }
//
//     console.log("File is deleted.");
// });
// }

bot.on('message', (msg) => {
  var NewMsg = "";

//SIMPLE PRICE
//FIND COIN ID BY SYMBOL

  if (msg.text.startsWith("/s")) {
    csymbol = msg.text.substr(3);
    for (var i = 0; i < coinsList.length; i++) {
      if (coinsList[i].symbol.toString() == csymbol) {
        cid = coinsList[i].id;
        cfound = true;
        break;
      } else {
        cid = csymbol;
        if (coinsList[i].id == cid) {
        cfound = true;
        break;
      } else {
        cfound = false;
      }
      }
    }

//GET COIN PRICE BY ID
  if (cfound) {
      axios.get(geckoAPI + '/simple/price?ids=' + cid +'&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true')
      .then(function (response) {
        var priceobj = response.data;
        console.log(priceobj)
        bot.sendMessage(msg.chat.id,
          cid.charAt(0).toUpperCase() + cid.slice(1) +
          '\nPrice: $' + nf.format(priceobj[cid].usd) +
          '\nMarket Cap: $' + nf.format(Math.round(priceobj[cid].usd_market_cap)) +
          '\n24h Volume: $' + nf.format(Math.round(priceobj[cid].usd_24h_vol)) +
          '\n24h Change:' + nf.format(Math.round((priceobj[cid].usd_24h_change + Number.EPSILON) * 100) / 100) + '%');
        cid = null;
        csymbol = null;
      });

    }  else {
          bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(3) + '" in the database.');
        }
      }
  //  }
    //EXPANDED PRICE
    //FIND COIN ID BY SYMBOL

      if (msg.text.startsWith("/e")) {
        csymbol = msg.text.substr(3);
        for (var i = 0; i < coinsList.length; i++) {
          if (coinsList[i].symbol.toString() == csymbol) {
            cid = coinsList[i].id;
            cfound = true;
            break;
          } else {
            cid = csymbol;
            if (coinsList[i].id == cid) {
            cfound = true;
            break;
          } else {
            cfound = false;
          }
          }
        }
    //DETAILED PRICE
    //GET COIN PRICE BY ID
  if (cfound) {
          axios.get(geckoAPI + '/coins/markets?vs_currency=usd&ids=' + cid +'&order=market_cap_desc&per_page=100&page=1&sparkline=false')
          .then(function (response) {
            var priceobj = response.data;
            console.log(priceobj)
            var available =
            '*' + priceobj[0].name + '*' +
            '\n*Rank:* #' + priceobj[0].market_cap_rank +
            '\n*Price:* $' + nf.format(Math.round((priceobj[0].current_price + Number.EPSILON) * 100) / 100) +
            '\n*Market Cap:* $' + nf.format(Math.round(priceobj[0].market_cap)) +
            '\n*24h Volume:* $' + nf.format(Math.round(priceobj[0].total_volume)) +
            '\n*24h High:* $' + nf.format(Math.round((priceobj[0].high_24h + Number.EPSILON) * 100) / 100) +
            '\n*24h Low:* $' + nf.format(Math.round((priceobj[0].low_24h + Number.EPSILON) * 100) / 100) +
            '\n*24h Change:* $' + nf.format(Math.round((priceobj[0].price_change_24h + Number.EPSILON) * 100) / 100) +
            '\n*24h Change:* ' + nf.format(Math.round((priceobj[0].price_change_percentage_24h + Number.EPSILON) * 100) / 100) + '%' +
            '\n*ATH: $*' + nf.format(Math.round((priceobj[0].ath + Number.EPSILON) * 100) / 100) +
            '\n*ATH Difference:* ' + nf.format(Math.round((priceobj[0].ath_change_percentage + Number.EPSILON) * 100) / 100) + '%' +
            '\n*ATL:* $' + nf.format(Math.round((priceobj[0].atl + Number.EPSILON) * 100) / 100) +
            '\n*ATL Difference:* ' + nf.format(Math.round((priceobj[0].atl_change_percentage + Number.EPSILON) * 100) / 100) + '%' +
            '\n*Circulating:* ' + nf.format(Math.round(priceobj[0].circulating_supply));

            if (priceobj[0].roi != null && priceobj[0].total_supply != null && priceobj[0].max_supply != null && priceobj[0].fully_diluted_valuation != null) {
            var missing =
            '\n*Total Supply:* ' + nf.format(Math.round(priceobj[0].total_supply)) +
            '\n*Max Supply:* ' + nf.format(Math.round(priceobj[0].max_supply)) +
            '\n*Diluted Valuation:* $' + nf.format(Math.round(priceobj[0].fully_diluted_valuation)) +
            '\n*ROI:* ' + nf.format(Math.round((priceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';

            var details = available + missing;

            console.log(details);
          } else if (priceobj[0].total_supply == null && priceobj[0].max_supply == null && priceobj[0].fully_diluted_valuation == null) {
            var missing =
            '\n*Total Supply:* N/A' +
            '\n*Max Supply:* N/A' +
            '\n*Diluted Valuation:* N/A' +
            '\n*ROI:* ' + nf.format(Math.round((priceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';

            var details = available + missing;

          } else if (priceobj[0].roi == null) {
            var missing =
            '\n*Total Supply:* ' + nf.format(Math.round(priceobj[0].total_supply)) +
            '\n*Max Supply:* ' + nf.format(Math.round(priceobj[0].max_supply)) +
            '\n*Diluted Valuation:* $' + nf.format(Math.round(priceobj[0].fully_diluted_valuation)) +
            '\n*ROI:* N/A';

            var details = available + missing;

          } else if (priceobj[0].max_supply == null && priceobj[0].fully_diluted_valuation == null) {
            var missing =
            '\n*Total Supply:* ' + nf.format(Math.round(priceobj[0].total_supply)) +
            '\n*Max Supply:* N/A' +
            '\n*Diluted Valuation:* N/A' +
            '\n*ROI:* ' + nf.format(Math.round((priceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';

            var details = available + missing;

          }
            bot.sendPhoto(msg.chat.id, priceobj[0].image, {caption: details, parse_mode: 'Markdown'});
            cid = null;
            csymbol = null;
          });
        }  else {
              bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(3) + '" in the database.');
            }
          }

          //PRICE CHART DAILY
          //FIND COIN ID BY SYMBOL

          if (msg.text.startsWith("/d")) {
            csymbol = msg.text.substr(3);
            for (var i = 0; i < coinsList.length; i++) {
              if (coinsList[i].symbol.toString() == csymbol) {
                cid = coinsList[i].id;
                cfound = true;
                break;
              } else {
                cid = csymbol;
                if (coinsList[i].id == cid) {
                cfound = true;
                break;
              } else {
                cfound = false;
              }
              }
            }

            //DAILY LINE CHART

            if (cfound) {
                axios.get(geckoAPI + '/coins/' + cid +'/market_chart?vs_currency=usd&days=7&interval=daily')
                .then(function (response) {
                  var priceobj = response.data;
                  console.log(priceobj.prices[0]);
                    var x0 = new Date(priceobj.prices[0][0]).toLocaleDateString("en-US");
                    var x1 = new Date(priceobj.prices[1][0]).toLocaleDateString("en-US");
                    var x2 = new Date(priceobj.prices[2][0]).toLocaleDateString("en-US");
                    var x3 = new Date(priceobj.prices[3][0]).toLocaleDateString("en-US");
                    var x4 = new Date(priceobj.prices[4][0]).toLocaleDateString("en-US");
                    var x5 = new Date(priceobj.prices[5][0]).toLocaleDateString("en-US");
                    var x6 = new Date(priceobj.prices[6][0]).toLocaleDateString("en-US");
                    var x7 = new Date(priceobj.prices[7][0]).toLocaleDateString("en-US");

                    var y0 = Math.round((priceobj.prices[0][1] + Number.EPSILON) * 100) / 100;
                    var y1 = Math.round((priceobj.prices[1][1] + Number.EPSILON) * 100) / 100;
                    var y2 = Math.round((priceobj.prices[2][1] + Number.EPSILON) * 100) / 100;
                    var y3 = Math.round((priceobj.prices[3][1] + Number.EPSILON) * 100) / 100;
                    var y4 = Math.round((priceobj.prices[4][1] + Number.EPSILON) * 100) / 100;
                    var y5 = Math.round((priceobj.prices[5][1] + Number.EPSILON) * 100) / 100;
                    var y6 = Math.round((priceobj.prices[6][1] + Number.EPSILON) * 100) / 100;
                    var y7 = Math.round((priceobj.prices[7][1] + Number.EPSILON) * 100) / 100;

                    console.log(x0);
                    console.log(x1);
                    console.log(x2);
                    console.log(x3);
                    console.log(x4);
                    console.log(x5);
                    console.log(x6);
                    console.log(x7);

                    console.log(y0);
                    console.log(y1);
                    console.log(y2);
                    console.log(y3);
                    console.log(y4);
                    console.log(y5);
                    console.log(y6);
                    console.log(y7);

                    const myChart = new ChartJsImage();
                    myChart.setConfig({
                      type: 'line',
                      data: {
                        labels: [x0, x1, x2, x3, x4, x5, x6, x7],
                        datasets: [{
                          label: csymbol.toUpperCase() + ' Price',
                          data: [y0, y1, y2, y3, y4, y5, y6, y7],
                          fill: true,
                          tension: 0.5
                        }]
                      }
                    });
                    myChart.toFile('mychart.png');
                    setTimeout(function () {
                    bot.sendPhoto(msg.chat.id, 'mychart.png');
                    }, 2500);
                    setTimeout(function () {
                      if (fs.existsSync('mychart.png')) {
                      fs.unlink('mychart.png', (err) => {
                          if (err) {
                              throw err;
                          }

                          console.log("File is deleted.");
                      });
                    }
                    }, 5000);

                  cid = null;
                  csymbol = null;
                });

              }  else {
                    bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(3) + '" in the database.');
                  }
                }


  //HOURLY LINE CHART


                if (msg.text.startsWith("/h")) {
                  csymbol = msg.text.substr(3);
                  for (var i = 0; i < coinsList.length; i++) {
                    if (coinsList[i].symbol.toString() == csymbol) {
                      cid = coinsList[i].id;
                      cfound = true;
                      break;
                    } else {
                      cid = csymbol;
                      if (coinsList[i].id == cid) {
                      cfound = true;
                      break;
                    } else {
                      cfound = false;
                    }
                    }
                  }

                  //HOURLY LINE CHART

                  if (cfound) {
                      axios.get(geckoAPI + '/coins/' + cid +'/market_chart?vs_currency=usd&days=1&interval=hourly')
                      .then(function (response) {
                        var priceobj = response.data;
                        console.log(priceobj.prices.length);
                          var x0 = new Date(priceobj.prices[0][0]).toLocaleTimeString("en-US");
                          var x1 = new Date(priceobj.prices[1][0]).toLocaleTimeString("en-US");
                          var x2 = new Date(priceobj.prices[2][0]).toLocaleTimeString("en-US");
                          var x3 = new Date(priceobj.prices[3][0]).toLocaleTimeString("en-US");
                          var x4 = new Date(priceobj.prices[4][0]).toLocaleTimeString("en-US");
                          var x5 = new Date(priceobj.prices[5][0]).toLocaleTimeString("en-US");
                          var x6 = new Date(priceobj.prices[6][0]).toLocaleTimeString("en-US");
                          var x7 = new Date(priceobj.prices[7][0]).toLocaleTimeString("en-US");

                          var y0 = Math.round((priceobj.prices[0][1] + Number.EPSILON) * 100) / 100;
                          var y1 = Math.round((priceobj.prices[1][1] + Number.EPSILON) * 100) / 100;
                          var y2 = Math.round((priceobj.prices[2][1] + Number.EPSILON) * 100) / 100;
                          var y3 = Math.round((priceobj.prices[3][1] + Number.EPSILON) * 100) / 100;
                          var y4 = Math.round((priceobj.prices[4][1] + Number.EPSILON) * 100) / 100;
                          var y5 = Math.round((priceobj.prices[5][1] + Number.EPSILON) * 100) / 100;
                          var y6 = Math.round((priceobj.prices[6][1] + Number.EPSILON) * 100) / 100;
                          var y7 = Math.round((priceobj.prices[7][1] + Number.EPSILON) * 100) / 100;

                          console.log(x0);
                          console.log(x1);
                          console.log(x2);
                          console.log(x3);
                          console.log(x4);
                          console.log(x5);
                          console.log(x6);
                          console.log(x7);

                          console.log(y0);
                          console.log(y1);
                          console.log(y2);
                          console.log(y3);
                          console.log(y4);
                          console.log(y5);
                          console.log(y6);
                          console.log(y7);

                          const myChart = new ChartJsImage();
                          myChart.setConfig({
                            type: 'line',
                            data: {
                              labels: [x0, x1, x2, x3, x4, x5, x6, x7],
                              datasets: [{
                                label: csymbol.toUpperCase() + ' Price',
                                data: [y0, y1, y2, y3, y4, y5, y6, y7],
                                fill: true,
                                tension: 0.5
                              }]
                            }
                          });
                          myChart.toFile('mychart.png');
                          setTimeout(function () {
                          bot.sendPhoto(msg.chat.id, 'mychart.png');
                          }, 2500);
                          setTimeout(function () {
                            if (fs.existsSync('mychart.png')) {
                            fs.unlink('mychart.png', (err) => {
                                if (err) {
                                    throw err;
                                }

                                console.log("File is deleted.");
                            });
                          }
                          }, 5000);

                        cid = null;
                        csymbol = null;
                      });

                    }  else {
                          bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(3) + '" in the database.');
                        }
                      }


                      // //CANDLECHART
                      // if (cfound) {
                      //
                      //   axios.get(geckoAPI + '/coins/' + cid +'/ohlc?vs_currency=usd&days=30')
                      //   .then(function (response) {
                      //     var priceobj = response.data;
                      //     var ctime = [];
                      //     var copen = [];
                      //     var chigh = [];
                      //     var clow = [];
                      //     var cclose = [];
                      //     for (var i = 0; i < priceobj.length; i++) {
                      //       ctime["ctime" + [i]] = new Date(priceobj[i][0]).toISOString().substr(0,10);
                      //       copen["copen" + [i]] = priceobj[i][1];
                      //       chigh["chigh" + [i]] = priceobj[i][2];
                      //       clow["clow" + [i]] = priceobj[i][3];
                      //       cclose["cclose" + [i]] = priceobj[i][4];
                      //
                      //
                      //
                      //     }
                      //
                      //     arrayData = [ctime, copen, chigh, clow, cclose];
                      //   //  console.log(arrayData);
                      //     var chartData = ohlc(arrayData).toChartData();
                      //
                      //     Object.keys(chartData)
                      //     chartData.candle[priceobj.length]
                      //     chartData.volume[priceobj.length]
                      //
                      //      const myChart = new ChartJsImage();
                      //      myChart.setConfig({
                      //        type: 'candlestick',
                      //        data: {
                      //          labels: [ctime],
                      //          datasets: [{
                      //            label: csymbol.toUpperCase() + ' Price',
                      //            data: [chartData],
                      //            fill: true,
                      //            tension: 0.5
                      //          }]
                      //        }
                      //      });
                      //      console.log(myChart);
                      //      myChart.toFile('mychart.png');
                      //    });
                      //
                      //
                      //
                      //     //OPTIONS END










  });
