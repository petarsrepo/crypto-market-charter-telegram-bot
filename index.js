const TelegramBot = require('node-telegram-bot-api');
const token = 'YOUR BOT TOKEN HERE';
const bot = new TelegramBot(token, {interval: 100, timeout: 20, polling: true});
bot.on("polling_error", console.log);
const geckoAPI = 'https://api.coingecko.com/api/v3';
const geckoWEB = 'https://www.coingecko.com/en/coins/';
const geckoHOT = 'https://www.coingecko.com/en/discover';
const axios = require('axios').default;
var nf = new Intl.NumberFormat();
var fs = require('fs');
const ChartJsImage = require('chartjs-to-image');
const Chart = require('chart.js')
const wojakIndex = 'https://api.wojakindex.biz/current_wojak_index.json';
const wojakImgs = 'https://api.wojakindex.biz/pink_wojaks.json';
const wImageUrl = 'https://i.4cdn.org/biz/';
//const ChartFinancial = require('chartjs-chart-financial')

var cid;
var csymbol;
var coinsList;
var cprice;
var tdata;
var imgfile;
var chartWk = false;
var chartMt = false;
var chartURL;

bot.getMe().then(function (me) {
    botuname = me.username;
});


//GET COINS LIST

async function loadCoins() {
    axios.get(geckoAPI + '/coins/list')
    .then(function (response) {
      coinsList = response.data;
    })

}

//UPDATE COINS LIST

loadCoins();
setTimeout(function(){
  loadCoins();
},24*60*60*60);


//START MESSAGE LISTENER

bot.on('message', (msg) => {
  var NewMsg = "";
  csymbol = msg.text.substr(3);


  //COIN INTERACTION COMMAND VARS
  var cInfo = "/i ";
  var cPrice = "/p ";
  var cWeek = "/w ";
  var cMonth = "/m ";

  if (msg.text.startsWith(cInfo)) {
    GetCoin();
    GetProjectInfo();
  }

  if (msg.text.startsWith(cPrice)) {
    GetCoin();
    GetPrice();
  }

  if (msg.text.startsWith(cWeek)) {
    chartURL = 'days=14&interval=daily';
    GetCoin();
    GetChart();
  }

  if (msg.text.startsWith(cMonth)) {
    chartURL = 'days=30&interval=daily';
    GetCoin();
    GetChart();
  }

//GET HELP

if (msg.text == "/help") {
  bot.sendMessage(msg.chat.id,
    "I am a bot that provides cryptocurrency market information and basic charting service. Commands are not case sensitive and work with both ticker symbol and full coin name. Candlestick charting coming soon. Command list: \n" +
    "\n/i - Get coin information e.g. /c bitcoin" +
    "\n/p - Get coin market data e.g. /p ethereum" +
    "\n/w - Get 14-day market data chart e.g. /w bnb" +
    "\n/m - Get 31-day market data chart e.g. /m link" +
    "\n/hot - Get the Top 7 Trending Coins on CoinGecko" +
    "\n/wjk - Get key metrics about the Wojak Index" +
    "\n/help - Get help on how to use my services"
  )};


//GET WOJAK INDEX




if (msg.text == "/wjk") {
var w1;
var w2;

  let wone = wojakIndex;
  let wtwo = wojakImgs;
  const wojOne = axios.get(wone);
  const wojTwo = axios.get(wtwo);

  axios.all([wojOne, wojTwo])
    .then(axios.spread((...responses) => {

  const wojakobj = responses[0];

  const wimageobj = responses[1];


    w1 = wojakobj.data;
  w2 = wimageobj.data;



    var wdate = new Date(w1.instant_ms).toLocaleDateString("en-US");
    var wtime = new Date (w1.instant_ms).toLocaleTimeString("en-US");
    var windex = Math.round((w1.pink_wojak_index + Number.EPSILON) * 100) / 100;
    var wojaks = w1.pink_wojaks;
    var wimages = w1.total_images;



    var rindex = Math.floor(Math.random() * w2.length)
    var filename = w2[rindex].filename;
    var url = wImageUrl + filename;
    bot.sendPhoto(msg.chat.id, url)
    }))
    };



//GET COIN

function GetCoin() {
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
}


//GET PROJECT INFO
function GetProjectInfo() {
if (cfound) {
  axios.get(geckoAPI + '/coins/' + cid)
  .then(function (response) {
    var priceobj = response.data;
    bot.sendPhoto(msg.chat.id, priceobj.image.large, {caption:
    '[' + priceobj.name + ']' + '(' + priceobj.links.homepage[0] + ')' + ' | ' + priceobj.symbol.toUpperCase() +
    '\n\n*Marketcap:* #' + priceobj.market_cap_rank +
    '\n*Sentiment:* ' + priceobj.sentiment_votes_up_percentage +
    '\n*CoinGecko:* ' + priceobj.coingecko_score +
    '\n*Development:* ' + priceobj.developer_score +
    '\n*Community:* ' + priceobj.community_score +
    '\n*Liquidity:* ' + priceobj.liquidity_score +
    '\n*Alexa Rank:* ' + priceobj.public_interest_stats.alexa_rank +
    '\n\n[Read more here...](' + geckoWEB + priceobj.name + ')',
    parse_mode: 'Markdown'});
  });
 }
}


//GET TOP TRENDING COINS

if (msg.text == "/hot") {
var pricebtc;
var hotobj;
let one = geckoAPI + '/simple/price?ids=bitcoin&vs_currencies=usd';
let two = geckoAPI + '/search/trending';
const requestOne = axios.get(one);
const requestTwo = axios.get(two);
axios.all([requestOne, requestTwo])
  .then(axios.spread((...responses) => {
const responseOne = responses[0];
const responseTwo = responses[1];
pricebtc = responseOne.data.bitcoin.usd;
hotobj = responseTwo.data;
var id = [];
var name = [];
var symbol = [];
var market_cap_rank = [];
var score = [];
var price = [];
var entry = [];
for (var i = 0; i < hotobj.coins.length; i++) {
  id[i] = hotobj.coins[i].item.id;
  name[i] = hotobj.coins[i].item.name;
  symbol[i] = hotobj.coins[i].item.symbol;
  market_cap_rank[i] = hotobj.coins[i].item.market_cap_rank;
  score[i] = hotobj.coins[i].item.score;
  price[i] = Number(hotobj.coins[i].item.price_btc * pricebtc).toFixed(2);
  entry[i] = "#" + market_cap_rank[i] + " | [" + name[i] + "](" + geckoWEB + id[i] + ") (" + symbol[i] + "): $" + price[i], {parse_mode: 'Markdown'};
}
bot.sendMessage(msg.chat.id, "[Top-7 Trending Coins on CoinGecko (24h):](" + geckoHOT + ")\n" + entry.join('\n'), {parse_mode: 'Markdown'});

}));
};


    //GET COIN PRICE
function GetPrice() {
  if (cfound) {
          axios.get(geckoAPI + '/coins/markets?vs_currency=usd&ids=' + cid +'&order=market_cap_desc&per_page=100&page=1&sparkline=false')
          .then(function (response) {
            var priceobj = response.data;
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
              bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(4) + '" in the database.');
            }
          }


//GET CHART

function GetChart(){
            if (cfound) {
                axios.get(geckoAPI + '/coins/' + cid +'/market_chart?vs_currency=usd&' + chartURL)
                .then(function (response) {
                  var priceobj = response.data;
                  var xval = [];
                  var yval = [];
                  var mval = [];
                  var vval = [];
                  for (var i = 0; i < priceobj.prices.length; i++) {
                    xval[i] = new Date(priceobj.prices[i][0]).toISOString().substr(8,2);
                    yval[i] = priceobj.prices[i][1].toFixed(2);
                    mval[i] = priceobj.market_caps[i][1].toFixed(2);
                    vval[i] = priceobj.total_volumes[i][1].toFixed(2);

                    //SET CHART CONFIG

                     var myChart = new ChartJsImage();
                     myChart.setConfig({
                       title: {
                         display: true,
                         text: csymbol.toUpperCase(),
                       },
                       type: 'line',
                       data: {
                         labels: xval,
                         datasets: [{
                           label: ' Price: $' + Number(yval[yval.length - 1]).toLocaleString('en-US', {
                           notation: 'compact',
                           compactDisplay: 'short',
                         }) + "     ",
                           data: yval,
                           pointStyle: 'line',
                           borderJoinStyle: 'round',
                           borderCapStyle: 'cap',
                           borderColor: 'rgba(0, 0, 200, 0.5)',
                           backgroundColor: 'rgba(0, 0, 200, 0.1)',
                           fill: true,
                           yAxisID: 'y-axis-2',
                           tension: 1,
                         },{
                           label: ' Mcap: $' + Number(mval[mval.length - 1]).toLocaleString('en-US', {
                           notation: 'compact',
                           compactDisplay: 'short',
                         }) + "     ",
                           type: 'bar',
                           data: mval,
                           borderColor: 'rgba(0, 200, 0, 0.9)',
                           backgroundColor: 'rgba(0, 200, 0, 0.7)',
                           fill: true,
                           grouped: false,
                           yAxisID: 'y-axis-1',
                           barThickness: 'flex',
                           categoryPercentage: 1,
                           barPercentage: 0.7,
                         },{
                           label: ' Volume: $' + Number(vval[vval.length - 1]).toLocaleString('en-US', {
                           notation: 'compact',
                           compactDisplay: 'short',
                         }) + "     ",
                           type: 'bar',
                           data: vval,
                           borderColor: 'rgba(200, 0, 0, 0.9)',
                           backgroundColor: 'rgba(200, 0, 0, 0.7)',
                           fill: true,
                           grouped: false,
                           yAxisID: 'y-axis-1',
                           barThickness: 'flex',
                           categoryPercentage: 1,
                           barPercentage: 0.7,
                         }]
                       }, options: {
                         title: {
                           display: true,
                           text: (cid.toUpperCase() + "( " + csymbol.toUpperCase() + ")"),
                           position: 'top',
                         },
                         layout: {

                           padding: 5,
                         },
                         legend: {

                           labels: {
                             padding: 5,
                           }
                         },
                         padding: 5,
                         responsive:true,
                         maintainAspectRatio: false,
                         scales: {
                           ticks: {
                             padding: 5,
                           },
                           grid: {
                             borderDashOffset: 5,
                             drawTicks: true,
                             offset: true,
                           },
                           bounds: 'ticks',
                           type: 'linear',
                           padding: 5,
                           x: {
                             type: 'category',
                             bounds: 'ticks',
                             position: 'bottom',
                             padding: 5,
                             beginAtZero: false,
                             grid: {
                               offset: true,
                             },
                             gridLines: {
                               offset: true,
                             },
                           },
                           yAxes: [{
                             ticks: {
                               autoSkip: true,
                               maxTicksLimit: 5,
                               callback: function(value, index, values) {
                                   return value.toLocaleString('en-US', {
                                   notation: 'compact',
                                   compactDisplay: 'short',
                                 })
                               }},
                             id: 'y-axis-1',
                             bounds: 'ticks',
                             type: 'linear',
                             position: 'right',
                             padding: 5,
                             beginAtZero: false,
                             display: true,
                             grid: {
                              offset: true,
                            },
                             gridLines: {
                              offset: true,
                            }
                          }, {
                             ticks: {
                               autoSkip: true,
                               maxTicksLimit: 5,
                             callback: function(value, index, values) {
                                 return value.toLocaleString('en-US', {
                                 notation: 'compact',
                                 compactDisplay: 'short',
                               })
                             }},
                             id: 'y-axis-2',
                            type: 'logarithmic',
                             bounds: 'ticks',
                             padding: 5,
                             position: 'left',
                             beginAtZero: false,
                             offset: false,
                            display: true,
                            grid: {
                              offset: true,
                            },
                             gridLines: {
                               offset: true,
                             }
                          }]
                         }
                       }
                     });
                     }

                     //RENDER CHART AND SEND TO CHAT

                    myChart.toFile('mychart.png');
                    bot.sendMessage(msg.chat.id, "Hang on, rendering chart...");
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
                    bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(4) + '" in the database.');
                  }
                }



                      // //CANDLECHART COMING WHEN https://github.com/chartjs/chartjs-chart-financial IS RELEASED



  });
