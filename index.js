const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, {interval: 100, timeout: 20, polling: true});
const botuname = process.env.BOTUNAME
bot.on("polling_error", console.log);
const geckoAPI = 'https://api.coingecko.com/api/v3';
const geckoWEB = 'https://www.coingecko.com/en/coins/';
const geckoHOT = 'https://www.coingecko.com/en/discover';
const axios = require('axios').default;
var nf = new Intl.NumberFormat();
var fs = require('fs');
const ChartJsImage = require('chartjs-to-image');
const Chart = require('chart.js')
const wojakPage = 'https://www.wojakindex.biz/';
const wojakIndex = 'https://api.wojakindex.biz/current_wojak_index.json';
const wojakImgs = 'https://api.wojakindex.biz/pink_wojaks.json';
const wImageUrl = 'https://i.4cdn.org/biz/';
const bizThread = 'http://boards.4chan.org/biz/thread/';
const bizAPI = 'https://a.4cdn.org/biz/threads.json';
const threadAPI = 'https://a.4cdn.org/biz/thread/';
const math = require('mathjs');
const coverCommands = ['media/global.gif', 'media/defi.gif', 'media/help.gif', 'media/hot.gif', 'media/about.gif', 'media/gas.gif' , 'media/top.gif'];
const coverBog = ['media/bog1.gif', 'media/bog2.gif', 'media/bog3.gif', 'media/bog4.gif', 'media/bog5.gif'];

//const ChartFinancial = require('chartjs-chart-financial') COMING SOON geckoAPI/coins/{id}/ohlc Get coin's OHLC

//KEY TIMEFRAMES IN UNIX
var fminute = 60000;
var fhour = 3600000;
var fday = 86400000;
var fweek = 604800000;
var fmonth = 2592000000;
var ftoday;
UpdateTime();

var minute = 60;
var hour = 3600;
var day = 86400;
var week = 604800;
var month = 2592000;
var today = Math.round((new Date()).getTime() / 1000);

async function UpdateTime() {
  ftoday = new Date().getTime();
//  console.log(today);
  setTimeout(function(){
    UpdateTime();
  },1000);
}


var cid;
var csymbol;
var msgsymbol = {};
var msgid;
var lastcsymbol;
var lastdetails;
var available;
var missing;
var details;
var cpriceobj;
var coinsList;
var cprice;
var tdata;
var imgfile;
var chartURL;
var tmamp = 0.182648401826484; //200 DAY AVERAGE RATIO
var fmamp = 0.045662100456621; //50 DAY AVERAGE RATIO
var xMins = false; //DISPLAYS MINUTES
var xHrs = false; //DISPLAY HOURS ONLY
var xHrsDays = false; //DISPLAY HOURS & DAYS
var xDays = false; //DISPLAYS DAYS



console.log(botuname);


//GET COINS LIST

async function loadCoins() {
    axios.get(geckoAPI + '/coins/list')
    .then(function (response) {
      coinsList = response.data;
    })
    console.log('Coins list updated.')
    setTimeout(function(){
      loadCoins();
    },fminute);
}

//UPDATE COINS LIST

loadCoins();

var linkmcap;
function GetLinkCap() {

axios.get(geckoAPI + '/coins/markets?vs_currency=usd&ids=' + 'chainlink' +'&order=market_cap_desc&per_page=1&page=1&sparkline=false')
  .then(function (response) {
      var priceobj = response.data;
      linkmcap = priceobj[0].market_cap;
    });
}

var ethprc;
function GetEthPrice() {
axios.get(geckoAPI + '/coins/markets?vs_currency=usd&ids=' + 'ethereum' +'&order=market_cap_desc&per_page=1&page=1&sparkline=false')
  .then(function (response) {
      var priceobj = response.data;
      ethprc = priceobj[0].current_price;

    });
}

GetLinkCap();
GetEthPrice();

//START MESSAGE LISTENER

bot.on('message', (msg) => {
  var uniMsg = msg.text.toLowerCase();
  csymbol = uniMsg.substr(3);


  //COIN INTERACTION COMMAND VARS
  var cInfo = "/i ";
  var cPrice = "/p ";
  var pHrs = "/ph "//10min int 4h
  var pDay = "/pd ";//2h int 24h
  var pWk = "/pw ";//12h int 7days
  var pMnt = "/pm ";//24h int 30 days
  var pQrt = "/pq ";//3days int 90d
  var pSixm = "/ps ";//3days int 180d
  var pYr = "/py ";//14day int year
  var iDay = "/id ";//1h int 24h
  var iWk = "/iw ";//1d int 7d
  var iFtnt = "/if ";//1d int 14d
  var iMonth = "/im ";//2d int 30d
  var iQrt = "/iq ";//8d int 90d
  var iSixm = "/is ";//12d int 180d
  var iYear = "/iy ";//24d int 365d

  var spit = "/spit ";

  if (uniMsg.startsWith(spit)) {
        var spitsymbol = uniMsg.substr(6);
        console.log(spitsymbol);
        bot.sendMessage (msg.chat.id, '@' + botuname + ' spits on ' + spitsymbol + '.');
    } else if (uniMsg == spit.substr(0,5)) {
        bot.sendMessage (msg.chat.id, '@' + botuname + ' spits on the ground. ');
    } else if (uniMsg == spit.substr(0,5) + '@' + botuname) {
        bot.sendMessage (msg.chat.id, '@' + botuname + ' spits on the ground. ');
    }


  if (uniMsg.startsWith(cInfo)) {
    csymbol = uniMsg.substr(3);
    GetCoin();
    GetProjectInfo();
  } else if (uniMsg == cInfo.substr(0,2)) {
    csymbol = 'link';
    GetCoin();
    GetProjectInfo();
  } else if (uniMsg == cInfo.substr(0,2) + '@' + botuname) {
    csymbol = 'link';
    GetCoin();
    GetProjectInfo();
  }

  if (uniMsg.startsWith(cPrice)) {
    csymbol = uniMsg.substr(3);
    GetCoin();
    GetPrice();
  } else if (uniMsg == cPrice.substr(0,2)) {
    csymbol = 'link';
    GetCoin();
    GetPrice();
  } else if (uniMsg == cPrice.substr(0,2) + '@' + botuname) {
    csymbol = 'link';
    GetCoin();
    GetPrice();
  }

  if (uniMsg.startsWith(pHrs)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 4 * hour) + '&to=' + today;
    xMins = true;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 3;
    cptimeframe = ': 4 Hours'
    GetCoin();
    GetChart();
  } else if (uniMsg == pHrs.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 4 * hour) + '&to=' + today;
    xMins = true;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 3;
    cptimeframe = ': 4 Hours'
    GetCoin();
    GetChart();
  } else if (uniMsg == pHrs.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 4 * hour) + '&to=' + today;
    xMins = true;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 3;
    cptimeframe = ': 4 Hours'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(pDay)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - day) + '&to=' + today;
    xMins = false;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 12;
    cptimeframe = ': 24 Hours'
    GetCoin();
    GetChart();
  } else if (uniMsg == pDay.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - day) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 12;
    cptimeframe = ': 24 Hours'
    GetCoin();
    GetChart();
  } else if (uniMsg == pDay.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - day) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 12;
    cptimeframe = ': 24 Hours'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(pWk)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - week) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = true;
    xDays = false;
    timeMP = 8;
    cptimeframe = ': 7 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pWk.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - week) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = true;
    xDays = false;
    timeMP = 8;
    cptimeframe = ': 7 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pWk.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - week) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = true;
    xDays = false;
    timeMP = 8;
    cptimeframe = ': 7 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(pMnt)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 21;
    cptimeframe = ': 30 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pMnt.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 21;
    cptimeframe = ': 30 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pMnt.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 21;
    cptimeframe = ': 30 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(pQrt)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 3 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 100;
    cptimeframe = ': 90 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pQrt.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 3 * month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 100;
    cptimeframe = ': 90 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pQrt.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 3 * month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 100;
    cptimeframe = ': 90 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(pSixm)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 6 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 7;
    cptimeframe = ': 180 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pSixm.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 6 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 7;
    cptimeframe = ': 180 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pSixm.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 6 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 7;
    cptimeframe = ': 180 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(pYr)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 12 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 14;
    cptimeframe = ': 365 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pYr.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 12 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 14;
    cptimeframe = ': 365 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == pYr.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 12 * month) + '&to=' + today;
    xMins = false;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 14;
    cptimeframe = ': 365 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(iDay)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=1';
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    cptimeframe = '24 Hours'
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iDay.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=1';
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    cptimeframe = '24 Hours'
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iDay.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=1';
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    cptimeframe = '24 Hours'
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(iWk)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=7';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '7 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iWk.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=7';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '7 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iWk.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=7';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '7 Days';
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(iFtnt)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=14';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '14 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iFtnt.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=14';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '14 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iFtnt.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=14';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '14 Days';
    GetCoin();
    GetCandleChart();
  }


  if (uniMsg.startsWith(iMonth)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=30';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '30 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iMonth.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=30';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '30 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iMonth.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=30';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '30 Days';
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(iQrt)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=90';
    xHrsMins = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '90 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iQrt.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=90';
    xHrsMins = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '90 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iQrt.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=90';
    xHrsMins = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '90 Days';
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(iSixm)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=180';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '180 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iSixm.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=180';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '180 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iSixm.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=180';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '180 Days';
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(iYear)) {
    csymbol = uniMsg.substr(4);
    cptimeframe = '1 Year'
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    chartURL = 'days=365';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iYear.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=365';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '1 Year'
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == iYear.substr(0,3) + '@' + botuname) {
    csymbol = 'link';
    chartURL = 'days=365';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '1 Year'
    GetCoin();
    GetCandleChart();
  }


  //ADD SUPPORT FOR DAILY, HOURLY & MINUTE CHARTS
  //use /coins/{id}/market_chart/range
//Get historical market data include price, market cap, and 24h volume within a range of timestamp (granularity auto)
// Data granularity is automatic (cannot be adjusted)
// 1 day from query time = 5 minute interval data
// 1 - 90 days from query time = hourly data
// above 90 days from query time = daily data (00:00 UTC)

//ABOUT
if (uniMsg == "/about" || uniMsg == "/about@" + botuname) {
  bot.sendChatAction(msg.chat.id, 'typing');
  bot.sendAnimation(msg.chat.id, coverCommands[4], {caption: '*This bot is developed by:* [STKDevworks](https://github.com/STKDevworks)' +
    '\n\nAvailable free-of-charge and not meant for commercial use. Modifications and self-hosting available with attribution. Image copyright belongs to their respective owners.' +
    '\n\nSupport by spreading the word, or donating:' +
    '\n\nBTC: `bc1qmzpk2lu4n8uq6peyqz2shuk09567vg5xmf6hka`' + '\n\n ETH/ERC-20: `0x2B306bFA3Ba2ECd43303D2D88EF5406C34459077`',
    parse_mode: 'Markdown'})
    };


//GET HELP

if (uniMsg == "/help" || uniMsg == "/help@" + botuname) {
  bot.sendChatAction(msg.chat.id, 'typing');
  bot.sendAnimation(msg.chat.id, coverCommands[2], {caption :
    "\n/i - `Get coin information e.g. /c btc`" +
    "\n/p - `Get coin market data e.g. /p ethereum`" +
    "\n/ph | /pd | /pw | /pm | /pq | /ps | /py - `Get price & volume chart for various time`" +
    "\n/id | /iw | /if | /im | /iq | /is | /iy - `Get price chart with indicators for various time`" +
    "\n/top | /hmap - `Get the Top 25 Coins by Marketcap in text or chart form`" +
    "\n/hot - `Get the Top 7 Trending Coins`" +
    "\n/gas - `Get the Gas Cost estimations`" +
    "\n/crypto - `Get global crypto market data`" +
    "\n/defi - `Get global DeFi market data`" +
    "\n/wjk - `Get key metrics about the Wojak Index`" +
    "\n/biz - `Get a random popular thread on /biz/`" +
    "\n/quote - `Get a random crypto quote`" +
    "\n/about - `Get developer and licensing info`"
  , parse_mode: 'Markdown'})};


//GET QUOTE
const quoteList =
['<i>' + '"If you don’t believe it or don’t get it, I don’t have the time to try to convince you, sorry."' + '</i>' + '\n\n – Satoshi Nakamoto',

'<i>' + '"I see Bitcoin as ultimately becoming a reserve currency for banks, playing much the same role as gold did in the early days of banking. Banks could issue digital cash with greater anonymity and lighter weight, more efficient transactions."' + '</i>' + '\n\n – Hal Finney',

'<i>' + '"Any time a country transitioned to a fiat currency, they collapsed. That’s just world history; you don’t have to know about cryptocurrency to know that."' + '</i>' + '\n\n – Nipsey Hussle',

'<i>' + '"If the cryptocurrency market overall or a digital asset is solving a problem, it’s going to drive some value."' + '</i>' + '\n\n –  Brad Garlinghouse',

'<i>' + '"Whenever the price of cryptocurrency is rallying, people start spending a lot more."' + '</i>' + '\n\n – Erik Voorhees',

'<i>' + '"We are seeing more managed money and, to an extent, institutional money entering the [crypto] space. Anecdotally speaking, I know of many people who are working at hedge funds or other investment managers who are trading cryptocurrency personally, the question is, when do people start doing it with their firms and funds?"' + '</i>' + '\n\n – Olaf Carlson-Wee',

'<i>' + '"I am very excited about the prospect of using cryptocurrency, not just as a money equivalent, but using it as a way to earn something as a result of doing some type of work."' + '</i>' + '\n\n – William Mougayar',

'<i>' + '"What value does cryptocurrency add? No one’s been able to answer that question to me."' + '</i>' + '\n\n – Steve Eisman',

'<i>' + '"Bitcoin is here to stay. There would be a hacker uproar to anyone who attempted to take credit for the patent of cryptocurrency. And I wouldn’t want to be on the receiving end of hacker fury."' + '</i>' + '\n\n – Adam Draper',

'<i>' + '"I am very intrigued by Bitcoin. It has all the signs. Paradigm shift, hackers love it, yet it is described as a toy. Just like microcomputers."' + '</i>' + '\n\n – Paul Graham',

'<i>' + '"Blockchain is the tech. Bitcoin is merely the first mainstream manifestation of its potential."' + '</i>' + '\n\n – Marc Kenigsberg',

'<i>' + '"As the value goes up, heads start to swivel and skeptics begin to soften. Starting a new currency is easy, anyone can do it. The trick is getting people to accept it because it is their use that gives the “money” value."' + '</i>' + '\n\n – Adam B. Levine',

'<i>' + '"Bitcoin will do to banks what email did to the postal industry"' + '</i>' + '\n\n – Rick Falkvinge',

'<i>' + '"Bitcoin is a technological tour de force."' + '</i>' + '\n\n – Bill Gates',

'<i>' + '"Well, I think it is working. There may be other currencies like it that may be even better. But in the meantime, there’s a big industry around Bitcoin— People have made fortunes off Bitcoin, some have lost money. It is volatile, but people make money off of volatility too."' + '</i>' + '\n\n – Richard Branson',

'<i>' + '"[Bitcoin] is a remarkable cryptographic achievement… The ability to create something which is not duplicable in the digital world has enormous value…Lot’s of people will build businesses on top of that."' + '</i>' + '\n\n – Eric Schmidt',

'<i>' + '"PayPal had these goals of creating a new currency. We failed at that, and we just created a new payment system. I think Bitcoin has succeeded on the level of a new currency, but the payment system is somewhat lacking. It’s very hard to use, and that’s the big challenge on the Bitcoin side."' + '</i>' + '\n\n – Peter Thiel',

'<i>' + '"Bitcoin actually has the balance and incentives center, and that is why it is starting to take off."' + '</i>' + '\n\n – Julian Assange',

'<i>' + '"Bitcoin is the beginning of something great: a currency without a government, something necessary and imperative."' + '</i>' + '\n\n – Nassim Taleb, Author and Risk Analyst',

'<i>' + '"Bitcoin, and the ideas behind it, will be a disrupter to the traditional notions of currency. In the end, currency will be better for it."' + '</i>' + '\n\n – Edmund Moy, 38th Director of the United States Mint',

'<i>' + '"Right now Bitcoin feels like the Internet before the browser."' + '</i>' + '\n\n – Wences Casares',

'<i>' + '"[Bitcoin] is a very exciting development, it might lead to a world currency. I think over the next decade it will grow to become one of the most important ways to pay for things and transfer assets."' + '</i>' + '\n\n – Kim Dotcom, CEO of MegaUpload',

'<i>' + '"The Federal Reserve simply does not have authority to supervise or regulate Bitcoin in any way."' + '</i>' + '\n\n – Janet Yellen, former chair of the US Federal Reserve',

'<i>' + '"EVERY informed person needs to know about Bitcoin because it might be one of the world’s most important developments."' + '</i>' + '\n\n – Leon Louw, two-time Nobel Peace Prize nominee',

'<i>' + '"Bitcoin may be the TCP/IP of money."' + '</i>' + '\n\n – Paul Buchheit',

'<i>' + '"Whereas most technologies tend to automate workers on the periphery doing menial tasks, blockchains automate away the center. Instead of putting the taxi driver out of a job, blockchain puts Uber out of a job and lets the taxi drivers work with the customer directly."' + '</i>' + '\n\n – Vitalik Buterin, co-founder of Ethereum',

'<i>' + '"Cryptographical solutions might with great propriety be introduced into academies as the means of giving tone to the most important of the powers of the mind."' + '</i>' + '\n\n – Edgar Allan Poe',

'<i>' + '"It’s gold for nerds."' + '</i>' + '\n\n – Stephan Colbert, Comedian',

'<i>' + '"If [Bitcoin does] not [reach $500.000 by the end of 2020], I will eat my d*ck on national television."' + '</i>' + '\n\n – John McAfee – founder McAfee antivirus',

'<i>' + '"I understand the political ramifications of [bitcoin] and I think that the government should stay out of them and they should be perfectly legal."' + '</i>' + '\n\n – Ron Paul, Republican Texas Congressman and former candidate for US President',

'<i>' + '"I think the fact that within the bitcoin universe an algorithm replaces the functions of [the government] is actually pretty cool. I am a big fan of Bitcoin."' + '</i>' + '\n\n – Al Gore, 45th Vice President of the United States',

'<i>' + '"Cryptocurrency is such a powerful concept that it can almost overturn governments"' + '</i>' + '\n\n – Charles Lee, Creator of Litecoin',

'<i>' + '"The reason we are all here is that the current financial system is outdated."' + '</i>' + '\n\n – Charlie Shrem – founder & CEO Bitinstant',

'<i>' + '"There are 3 eras of currency: Commodity based, politically based, and now, math-based."' + '</i>' + '\n\n – Chris Dixon',

'<i>' + '"At their core, cryptocurrencies are built around the principle of a universal, inviolable ledger, one that is made fully public and is constantly being verified by these high-powered computers, each essentially acting independently of the others."' + '</i>' + '\n\n – Paul Vigna',

'<i>' + '"I love seeing new services constantly starting to accept Bitcoin. Bitcoin is really becoming “the currency of the Internet.” I’m most concerned by possible government reactions to Bitcoin. They can’t destroy Bitcoin, but they could really slow things down by making exchange much more difficult."' + '</i>' + '\n\n – Michael Marquardt',

'<i>' + '"Bitcoin is Money Over Internet Protocol."' + '</i>' + '\n\n – Tony Gallippi',

'<i>' + '"If Satoshi had released Bitcoin 10 yrs. earlier, 9/11 would never have happened."' + '</i>' + '\n\n – Max Keiser',

'<i>' + '"One must acknowledge with cryptography no amount of violence will ever solve a math problem."' + '</i>' + '\n\n – Jacob Appelbaum',

'<i>' + '"At its core, bitcoin is a smart currency, designed by very forward-thinking engineers. It eliminates the need for banks, gets rid of credit card fees, currency exchange fees, money transfer fees, and reduces the need for lawyers in transitions… all good things"' + '</i>' + '\n\n – Peter Diamandis',

'<i>' + '"When I first heard about Bitcoin, I thought it was impossible. How can you have a purely digital currency? Can’t I just copy your hard drive and have your bitcoins? I didn’t understand how that could be done, and then I looked into it and it was brilliant."' + '</i>' + '\n\n – Jeff Garzik',

'<i>' + '"The governments of the world have spent hundreds and hundreds of trillions of dollars bailing out a decaying, dickensian, outmoded system called banking when the solution to the future of finance is peer-to-peer. It’s going to be alternative currencies like Bitcoin and it’s not actually going to be a banking system as we had before 2008."' + '</i>' + '\n\n – Patrick Young',

'<i>' + '"We have elected to put our money and faith in a mathematical framework that is free of politics and human error."' + '</i>' + '\n – Tyler Winklevoss',

'<i>' + '"Hey, obviously this is a very interesting time to be in Bitcoin center now, but if you guys want to argue over whether this is reality or not, one Bitcoin will feed over 40 homeless people in Pensacola center now. If you guys want proof Bitcoin is real, send them to me, I’ll cash them out and feed homeless people."' + '</i>' + '\n\n – Jason King',

'<i>' + '"The bitcoin world is this new ecosystem where it doesn’t cost that much to start a new Bitcoin company, it doesn’t cost much to start owning Bitcoin either, and it is a much more efficient way of moving money around the world."' + '</i>' + '\n\n – Tim Draper',

'<i>' + '"Bitcoin enables certain uses that are very unique. I think it offers possibilities that no other currency allows. For example the ability to spend a coin that only occurs when two separate parties agree to spend the coin; with a third party that couldn’t run away with the coin itself."' + '</i>' + '\n\n – Pieter Wuille',

'<i>' + '"Bitcoin is Cash with Wings"' + '</i>' + '\n\n – Charlie Shrem',

'<i>' + '"It was the amateurs of cryptology who created the species. The professionals, who almost certainly surpassed them in cryptanalytic expertise, concentrated on down-to-earth problems of the systems that were then in use but are now outdated. The amateurs, unfettered to those realities, soared into the empyrean of theory."' + '</i>' + '\n\n – David Kahn',

'<i>' + '"Bitcoin is the currency of resistance."' + '</i>' + '\n\n – Max Keiser',

'<i>' + '"What can’t kill Bitcoin, makes it stronger."' + '</i>' + '\n\n – Mark Wittkowski',

'<i>' + '"You should be taking this technology as seriously as you should have been taking the development of the Internet in the early 1990’s."' + '</i>' + '\n\n – Blythe Masters',

'<i>' + '"I think the internet is going to be one of the major forces for reducing the role of government. The one thing that’s missing but that will soon be developed is a reliable e-cash."' + '</i>' + '\n\n – Milton Friedman',

'<i>' + '"What affected me most profoundly was the realization that the sciences of cryptography and mathematics are very elegant, pure sciences. I found that the ends for which these pure sciences are used are less elegant."' + '</i>' + '\n\n – Jim Sanborn',

'<i>' + '"Cryptography is the essential building block of independence for organizations on the Internet, just like armies are the essential building blocks of states because otherwise one state just takes over another."' + '</i>' + '\n\n – Julian Assange',

'<i>' + '"Bitcoin was created to serve a highly political intent, a free and uncensored network where all can participate with equal access."' + '</i>' + '\n\n – Amir Taaki',

'<i>' + '"Lots of people working in cryptography have no deep concern with real application issues. They are trying to discover things clever enough to write papers about."' + '</i>' + '\n\n – Whitfield Diffie',

'<i>' + '"Trusted third parties are security holes."' + '</i>' + '\n\n – Nick Szabo ',

'<i>' + '"This [Bitcoin] may be the purest form of democracy the world has ever known, and I — for one — am thrilled to be here to watch it unfold."' + '</i>' + '\n\n – Paco Ahlgren',

'<i>' + '"Cryptography shifts the balance of power from those with a monopoly on violence to those who comprehend mathematics and security design."' + '</i>' + '\n\n – Jacob Appelbaum',

'<i>' + '"[Cryptourrencies] may hold long-term promise, particularly if the innovations promote a faster, more secure and more efficient payment system."' + '</i>' + '\n\n – Ben Bernanke',

'<i>' + '"Online identity and reputation will be decentralized. We will own the data that belongs to us."' + '</i>' + '\n\n – William Mougayar',

'<i>' + '"It just identifies how much money laundering there is being done in the world,” Fink said. “How much people are trying to move currencies from one place to another."' + '</i>' + '\n\n – Larry Fink',

'<i>' + '"Gold is a great way to preserve wealth, but it is hard to move around. You do need some kind of alternative and Bitcoin fits the bill. I’m not surprised to see that happening."' + '</i>' + '\n\n – Jim Rickards',

'<i>' + '"What we want is fully anonymous, ultra-low transaction cost, transferable units of exchange. If we get that going… the banks will become the obsolete dinosaurs they deserve to become."' + '</i>' + '\n\n – Adam Back',

'<i>' + '"The blockchain is an incorruptible digital ledger of economic transactions that can be programmed to record not just financial transactions but virtually everything of value."' + '</i>' + '\n\n – Don & Alex Tapscott',

'<i>' + '"[Bitcoin is] the biggest opportunity set we can think of over the next decade."' + '</i>' + '\n\n – Bob Grifeld',

'<i>' + '"Since we’re all rich with bitcoins … we ought to put some of this unearned wealth to good use."' + '</i>' + '\n\n – Hal Finney',

'<i>' + '"Bitcoin seems to be a very promising idea. I like the idea of basing security on the assumption that the CPU power of honest participants outweighs that of the attacker. It is a very modern notion that exploits the power of the long tail."' + '</i>' + '\n\n – Hal Finney',

'<i>' + '"The computer can be used as a tool to liberate and protect people, rather than to control them."' + '</i>' + '\n\n – Hal Finney',

'<i>' + '"Lost coins only make everyone else’s coins worth slightly more. Think of it as a donation to everyone."' + '</i>' + '\n\n – Satoshi Nakamoto',

'<i>' + '"Sigh… why delete a wallet instead of moving it aside and keeping the old copy just in case? You should never delete a wallet."' + '</i>' + '\n\n – Satoshi Nakamoto',

'<i>' + '"The possibility to be anonymous or pseudonymous relies on you not revealing any identifying information about yourself in connection with the bitcoin addresses you use. If you post your bitcoin address on the web, then you’re associating that address and any transactions with it with the name you posted under. If you posted under a handle that you haven’t associated with your real identity, then you’re still pseudonymous. For greater privacy, it’s best to use bitcoin addresses only once."' + '</i>' + '\n\n – Satoshi Nakamoto',

'<i>' + '"At the end of the day, Bitcoin is programmable money."' + '</i>' + '\n\n – Andreas Antonopoulos',

'<i>' + '"One of my favorite words is a French word: sousveillance. It is the opposite of surveillance. Surveillance means to look from above; sousveillance means to look from below."' + '</i>' + '\n\n – Andreas Antonopoulos',

'<i>' + '"Bitcoin experts argue that deflation is not bad per se. Rather, deflation is associated with a collapse in demand because that is the only example of deflation we have to study."' + '</i>' + '\n\n – Andreas Antonopoulos',

'<i>' + '"[Bitcoin is] worse than tulip bulbs"' + '</i>' + '\n\n – Jamie Dimon, CEO of JP Morgan',

'<i>' + '"Stay away from it. It’s a mirage, basically. In terms of cryptocurrencies, generally, I can say almost with certainty that they will come to a bad ending."' + '</i>' + '\n\n –  Warren Buffett, legendary investor',

'<i>' + '"Bitcoin, and the ideas behind it, will be a disrupter to the traditional notions of currency. In the end, currency will be better for it."' + '</i>' + '\n\n – Edmund Moy, 38th Director of the United States Mint',

'<i>' + '"Bitcoin is evil."' + '</i>' + '\n\n – Paul Krugman, Nobel-prize winning economist',

{parse_mode: 'HTML'}

]

if (uniMsg == "/quote" || uniMsg == "/quote@" + botuname) {
bot.sendChatAction(msg.chat.id, 'typing');
bot.sendAnimation(msg.chat.id, coverBog[Math.round(Math.random(coverBog.length))], { caption: quoteList[Math.round(Math.random(quoteList.length))] , parse_mode: 'HTML' });
};

//GET BIZ THREADS
var threadurl;
var threadjson;
var thrimgurl;
var thrselect;
var selindex;
var thrsrchindex;
if (uniMsg == "/biz" || uniMsg == "/biz@" + botuname) {
axios.get(bizAPI)
.then (function(response) {
  var bizobj = response.data;
  var topthreads = [];

for (var i = 0; i < 5; i++) {
  bizobj[i].threads.sort(function(a,b) {
    return b.replies - a.replies;
  });
  topthreads[i] = new Array(bizobj[i].threads[0].no, bizobj[i].threads[1].no, bizobj[i].threads[2].no);
}

  var joined = topthreads.join(',');
  thrselect = joined.split(',');
  selindex = Math.round(Math.random(thrselect.length));
  threadurl = bizThread + thrselect[selindex];
  threadjson = threadAPI + thrselect[selindex];

  axios.get(threadjson + '.json')
  .then (function(response) {

    var threadobj = response.data;

    for (var i = 0; i < threadobj.posts.length; i++) {
      if (thrselect[selindex] == threadobj.posts[i].no) {
        thrsrchindex = i;
      }
    } console.log(threadurl)
    //var thdbdy = threadobj.posts[thrsrchindex].com.substr(0, 200);
    thrimgurl = wImageUrl + threadobj.posts[thrsrchindex].tim + threadobj.posts[thrsrchindex].ext;
    bot.sendChatAction(msg.chat.id, 'typing');
    bot.sendPhoto(msg.chat.id, thrimgurl, { caption: ' * ' + '' + threadobj.posts[thrsrchindex].sub + '' + ' * ' +
    '\n' + threadobj.posts[thrsrchindex].replies + ' replies from ' + threadobj.posts[thrsrchindex].unique_ips + ' IDs: ' +
    '\n[Read Full Story on /biz/]' + '(' + threadurl + ')' , parse_mode: 'Markdown' });
  })
  })

};




//GET WOJAK INDEX


if (uniMsg == "/wjk" || uniMsg == "/wjk@" + botuname) {
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
    var windex = w1.pink_wojak_index.toLocaleString('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    });
    var wojaks = w1.pink_wojaks;
    var wimages = w1.total_images;
    var wshare = (wojaks / wimages).toFixed(2);
    var rindex = Math.floor(Math.random() * w2.length)
    var wothreadID = w2[rindex].thread_id;
    var wjkfile = w2[rindex].filename;
    var url = wImageUrl + wjkfile;
    var bizurl = 'boards.4chan.org/biz/thread/';
    var wexstr = "Wojak Index now at: ";
    if (windex >= 250) {
      var reply = "Don't worry McDonald's is still hiring...";
    } else {
      var reply = "Panic levels are still within parameters.";
    }
    bot.sendChatAction(msg.chat.id, 'typing');
    bot.sendPhoto(msg.chat.id, url, {
      caption: wexstr + '*' + windex + ' (' + wshare + '%)*'+
      '\n' + reply +
      '\n' + '[Visit Wojak Thread](' + bizurl + wothreadID + ') | [Browse Wojak Index](' + wojakPage + ')' , parse_mode: 'Markdown'
    });
    }))
    };

//GET CRYPTO MARKET DATA

if (uniMsg == "/crypto" || uniMsg == "/crypto@" + botuname) {
GetLinkCap();
axios.get(geckoAPI + '/global')
.then (function (response) {
  var respobj = response.data;
  var totalcoins = respobj.data.active_cryptocurrencies;
  var upcico = respobj.data.upcoming_icos;
  var ongico = respobj.data.ongoing_icos;
  var endico = respobj.data.ended_icos;
  var mkts = respobj.data.markets;
  var tmcap = respobj.data.total_market_cap.usd.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
  var tvol = respobj.data.total_volume.usd.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
  var btcdom = respobj.data.market_cap_percentage.btc.toFixed(2);
  var linkdom = (linkmcap / respobj.data.total_market_cap.usd).toFixed(4);
  GetLinkCap();
  bot.sendChatAction(msg.chat.id, 'typing');
  bot.sendAnimation(msg.chat.id, coverCommands[0], { caption: '*Global Market Data - Crypto:*' +
  '\n*Total Coins:* ' + totalcoins +
  '\n*Upcoming ICOs:* ' + upcico +
  '\n*Ongoing ICOs:* ' + ongico +
  '\n*Ended ICOs:* ' + endico +
  '\n*Markets:* ' + mkts +
  '\n*Total Market Cap:* $' + tmcap +
  '\n*Total Volume (24h):* $' + tvol +
  '\n*Bitcoin Dominance:* ' + btcdom + '%' +
  '\n*Chainlink Dominance:* ' + linkdom + '%' , parse_mode: 'Markdown'});
});
}

//GET DEFI MARKET INFORMATION

if (uniMsg == "/defi" || uniMsg == "/defi@" + botuname) {
  axios.get(geckoAPI + '/global/decentralized_finance_defi')
  .then (function (response) {
    var respobj = response.data;
    var defimcap = Number(respobj.data.defi_market_cap).toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
    var ethmcap = Number(respobj.data.eth_market_cap).toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
    var defieth = Number(respobj.data.defi_to_eth_ratio).toFixed(2);
    var defivol = Number(respobj.data.trading_volume_24h).toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
    var defidom = Number(respobj.data.defi_dominance).toFixed(2);
    var defitop = respobj.data.top_coin_name;
    var defitopdom = Number(respobj.data.top_coin_defi_dominance).toFixed(2);
    bot.sendChatAction(msg.chat.id, 'typing');
    bot.sendAnimation(msg.chat.id, coverCommands[1], { caption: '*Global Market Data - DeFi:*' +
    '\n*DeFi Market Cap:* ' + defimcap +
    '\n*ETH Market Cap:* ' + ethmcap +
    '\n*DeFi to ETH:* ' + defieth + '%' +
    '\n*DeFi Volume (24h):* ' + defivol +
    '\n*DeFi Dominance:* ' + defidom + '%' +
    '\n*Top DeFi Coin:* $' + defitop +
    '\n*Top DeFi Dominance:* $' + defitopdom + '%', parse_mode: 'Markdown'});
  });
}

//GET GAS PRICE ESTIMATIONS

if (uniMsg == "/gas" || uniMsg == "/gas@" + botuname) {
GetEthPrice();
      console.log(ethprc)
axios.get('https://api.etherscan.io/api?module=gastracker&action=gasoracle')
.then (function (response) {
  var respobj = response.data;
  console.log(response.data.result.SafeGasPrice)
  var gsfe = 21000 * response.data.result.SafeGasPrice * ethprc / 1000000000;
  var gavg = 21000 * response.data.result.ProposeGasPrice * ethprc / 1000000000;
  var ghgh = 21000 * response.data.result.FastGasPrice * ethprc / 1000000000;
  var gtsfe = 65000 * response.data.result.SafeGasPrice * ethprc / 1000000000;
  var gtavg = 65000 * response.data.result.ProposeGasPrice * ethprc / 1000000000;
  var gthgh = 65000 * response.data.result.FastGasPrice * ethprc / 1000000000;
  var gssfe = 200000 * response.data.result.SafeGasPrice * ethprc / 1000000000;
  var gsavg = 200000 * response.data.result.ProposeGasPrice * ethprc / 1000000000;
  var gshgh = 200000 * response.data.result.FastGasPrice * ethprc / 1000000000;
  var glsfe = 175000 * response.data.result.SafeGasPrice * ethprc / 1000000000;
  var glavg = 175000 * response.data.result.ProposeGasPrice * ethprc / 1000000000;
  var glhgh = 175000 * response.data.result.FastGasPrice * ethprc / 1000000000;
  console.log(gsfe, gavg, ghgh, gtsfe, gtavg, gthgh, gssfe, gsavg, gshgh, glsfe, glavg, glhgh,)
  var gstr = '*Ethereum Network Gas Fees: *' + '\n' +
  '*Ethereum: *' + '*Low: *$' + gsfe.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' | *Avg: *$' + gavg.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Fast: *$' + ghgh.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + '\n' +
  '*Token: *' + '*Low: *$' + gtsfe.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Avg: *$' + gtavg.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Fast: *$' + gthgh.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + '\n' +
  '*Swap: *' + '*Low: *$' + gssfe.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Avg: *$' + gsavg.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Fast: *$' + gshgh.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + '\n' +
  '*Liquidity: *' + '*Low: *$' + glsfe.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Avg: *$' + glavg.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2}) + ' * | Fast: *$' + glhgh.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2});
  bot.sendChatAction(msg.chat.id, 'typing');
  bot.sendAnimation(msg.chat.id, coverCommands[5], {caption: gstr, parse_mode: 'Markdown'});
})
}

//GET TOP TRENDING COINS

if (uniMsg == "/hot" || uniMsg == "/hot@" + botuname) {
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
bot.sendChatAction(msg.chat.id, 'typing');
bot.sendAnimation(msg.chat.id, coverCommands[3], { caption: "[Top-7 Trending Coins on CoinGecko (24h):](" + geckoHOT + ")\n" + entry.join('\n'), parse_mode: 'Markdown'});

}));
};






//GET TOP 25 24 HOUR
if (uniMsg == "/top" || uniMsg == "/top@" + botuname) {
  axios.get(geckoAPI + '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false')
  .then (function (response) {
    var respobj = response.data;
    var smb = [];
    var prc = [];
    var prh = [];
    var prl = [];
    var prcc = [];
    var prcp = [];
    var toptext = [];
    var chg = [];
    var chgcmt;
    for (var i = 0; i < respobj.length; i++) {
      // console.log(respobj[i]);
      smb[i] = respobj[i].symbol.toUpperCase();
      prc[i] = respobj[i].current_price.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
      prh[i] = respobj[i].high_24h.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
      prl[i] = respobj[i].low_24h.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
      prcc[i] = respobj[i].price_change_24h.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
      prcp[i] = respobj[i].price_change_percentage_24h.toFixed(2);
      chg[i] = respobj[i].price_change_percentage_24h;

      toptext[i] = '*' + [1 + i] + '. ' + smb[i] + ':* $' + prc[i] + ' | H: $' + prh[i] + ' | L: $' + prl[i] + ' | 24h: $' + prcc[i] + ' / ' + prcp[i] + '%\n', { parse_mode: 'Markdown'};

    }
      avgchg = chg.reduce((a, b) => a + b, 0) / prcc.length
      avgchg = avgchg.toFixed(2);
      if (avgchg < -25 ){
        chgcmt = 'Here comes the Wojak train!';
      } else if (avgchg > 25 ) {
        chgcmt = 'Number go up! ';
      } else {
        chgcmt = "Crabfest galore...";
      };
console.log(toptext.join(','));
bot.sendMessage(msg.chat.id, '*Top 25 Coins by Marketcap:* \n' + toptext.join('') + '\n *Average Change: ' + avgchg + '% | ' + chgcmt + '*', {parse_mode: 'Markdown'});
})

};



//GET HEATMAP CHART

var hmsym = [];
var hmprc = [];
var hmprcp = [];
var hmcol = [];
var hmtxt = [];

if (uniMsg == "/hmap" || uniMsg == "/hmap@" + botuname) {

  axios.get(geckoAPI + '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false')
  .then (function (response) {
    var respobj = response.data;
    for (var i = 0; i < respobj.length; i++) {
      hmsym[i] = respobj[i].symbol.toUpperCase();;
      hmprc[i] = respobj[i].current_price.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'});
      hmprcp[i] = respobj[i].price_change_percentage_24h;
      hmtxt[i] = '*' + hmsym[i] + ':* $' + hmprc[i], {parse_mode: 'Markdown'};
    }

var myChart = new ChartJsImage();
for (var i = 0; i < hmprc.length; i++) {
var hmstr = hmtxt.join(' | ');


if (Math.sign(hmprcp[i]) == 1) {
  hmcol[i] = 'rgba(0, 200, 0, 1)';
} else if (Math.sign(hmprcp[i]) == -1) {
    hmcol[i] = 'rgba(200, 0, 0, 1)';
}
}
console.log (Math.sign(hmprcp));
myChart.setConfig({
  title: {
    display: true,
    text: 'Price Change %: 24h',
  },
  type: 'line',
  data: {
    labels: hmsym,
    datasets: [{
      id: 'bars',
      type: 'bar',
      label: 'Top 25 Coins by Marketcap: Price Change % 24h',
      data: hmprcp,
      borderColor: hmcol,
      backgroundColor: hmcol,
      fill: true,
      yAxisID: 'y-axis-2',
    },
//     {
//       id: 'line',
//       type: 'line',
//       pointRadius: 0,
// //      label: 'Top 25 Coins by Marketcap: Price Change % 24h',
//       data: hmprc,
//       steppedLine: 'middle',
//       borderColor: 'rgba(0, 0, 200, 0.5)',
//       backgroundColor: 'rgba(0, 0, 200, 0.1)',
//       fill: true,
//       yAxisID: 'y-axis-1',
//     }
  ]
  }, options: {
    title: {
      display: true,
      text: 'Price Change %: 24h',
      position: 'top',
    },
    layout: {

      padding: 5,
    },
    legend: {
        display: false,
      labels: {
        display: false,
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
      type: 'logarithmic',
      padding: 5,
      xAxes: [{
        id: 'x-axis-1',
        type: 'category',
        bounds: 'data',
        position: 'bottom',
        padding: 5,
        beginAtZero: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 30,
        },
        grid: {
          offset: true,
        },
        gridLines: {
          offset: true,
        },
      }],
      yAxes: [{
        ticks: {
          autoSkip: true,
          maxTicksLimit: 8,
          callback: function(value, index, values) {
              return value.toLocaleString('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
              maximumFractionDigits: 8,
            })
          }},
        id: 'y-axis-2',
        bounds: 'ticks',
        type: 'linear',
        position: 'left',
        padding: 5,
        beginAtZero: true,
        display: true,
        grid: {
         offset: true,
       },
        gridLines: {
         offset: true,
       }
     },
    //  {
    //    ticks: {
    //      autoSkip: true,
    //      maxTicksLimit: 8,
    //      callback: function(value, index, values) {
    //          return value.toLocaleString('en-US', {
    //          notation: 'compact',
    //          compactDisplay: 'short',
    //          maximumFractionDigits: 8,
    //        })
    //      }},
    //    id: 'y-axis-1',
    //    bounds: 'data',
    //    type: 'logarithmic',
    //    position: 'left',
    //    padding: 5,
    //    beginAtZero: false,
    //    display: true,
    //    grid: {
    //     offset: true,
    //   },
    //    gridLines: {
    //     offset: true,
    //   }
    // }
  ]
    }
  }
});

myChart.toFile('mychart.png');
bot.sendChatAction(msg.chat.id, 'typing');
setTimeout(function () {
bot.sendPhoto(msg.chat.id, 'mychart.png', {caption: hmstr, parse_mode: 'Markdown'});
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
}, 3500);

cid = null;
csymbol = null;
})
};



// //GET LIQUIDATIONS
//
// if (uniMsg == "/rekt" || uniMsg == "/rekt@" + botuname) {
//   axios.get('https://api.tardis.dev/v1/data-feeds/bitmex?from=2019-08-01&filters=[%7B%22channel%22:%22liquidation%22%7D]&offset=1')
//   .then (function (response) {
//     var respobj = response.data;
//     console.log(respobj);
//
//   })};

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
    bot.sendChatAction(msg.chat.id, 'typing');
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

var cprc;
var cvol;
var chgh;
var clow;
var cchc;
var cath;
var catl;

    //GET COIN PRICE
function GetPrice() {

  if (cfound) {
          axios.get(geckoAPI + '/coins/markets?vs_currency=usd&ids=' + cid +'&order=market_cap_desc&per_page=100&page=1&sparkline=false')
          .then(function (response) {
            cpriceobj = response.data;

            cprc = cpriceobj[0].current_price.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });
            cvol = cpriceobj[0].total_volume.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });
            chgh = cpriceobj[0].high_24h.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });
            clow = cpriceobj[0].low_24h.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });
            cchc = cpriceobj[0].price_change_24h.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });
            cath = cpriceobj[0].ath.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });
            catl = cpriceobj[0].atl.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 8,
          });

            available =
            '*' + cpriceobj[0].name + '*' +
            '\n*Rank:* #' + cpriceobj[0].market_cap_rank +
            '\n*Price:* $' + cprc +
            '\n*Market Cap:* $' + nf.format(Math.round(cpriceobj[0].market_cap)) +
            '\n*24h Volume:* $' + cvol +
            '\n*24h High:* $' + chgh +
            '\n*24h Low:* $' + clow +
            '\n*24h Change:* $' + cchc +
            '\n*24h Change:* ' + nf.format(Math.round((cpriceobj[0].price_change_percentage_24h + Number.EPSILON) * 100) / 100) + '%' +
            '\n*ATH: $*' + cath +
            '\n*ATH Difference:* ' + nf.format(Math.round((cpriceobj[0].ath_change_percentage + Number.EPSILON) * 100) / 100) + '%' +
            '\n*ATL:* $' + catl +
            '\n*ATL Difference:* ' + nf.format(Math.round((cpriceobj[0].atl_change_percentage + Number.EPSILON) * 100) / 100) + '%' +
            '\n*Circulating:* ' + nf.format(Math.round(cpriceobj[0].circulating_supply));

            if (cpriceobj[0].roi != null && cpriceobj[0].total_supply != null && cpriceobj[0].max_supply != null && cpriceobj[0].fully_diluted_valuation != null) {
            missing =
            '\n*Total Supply:* ' + nf.format(Math.round(cpriceobj[0].total_supply)) +
            '\n*Max Supply:* ' + nf.format(Math.round(cpriceobj[0].max_supply)) +
            '\n*Diluted Valuation:* $' + nf.format(Math.round(cpriceobj[0].fully_diluted_valuation)) +
            '\n*ROI:* ' + nf.format(Math.round((cpriceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';

            details = available + missing;

          } else if (cpriceobj[0].total_supply == null && cpriceobj[0].max_supply == null && cpriceobj[0].fully_diluted_valuation == null) {
            missing =
            '\n*Total Supply:* N/A' +
            '\n*Max Supply:* N/A' +
            '\n*Diluted Valuation:* N/A' +
            '\n*ROI:* ' + nf.format(Math.round((cpriceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';

            details = available + missing;

          } else if (cpriceobj[0].roi == null) {
            missing =
            '\n*Total Supply:* ' + nf.format(Math.round(cpriceobj[0].total_supply)) +
            '\n*Max Supply:* ' + nf.format(Math.round(cpriceobj[0].max_supply)) +
            '\n*Diluted Valuation:* $' + nf.format(Math.round(cpriceobj[0].fully_diluted_valuation)) +
            '\n*ROI:* N/A';

            details = available + missing;

          } else if (cpriceobj[0].max_supply == null && cpriceobj[0].fully_diluted_valuation == null) {
            missing =
            '\n*Total Supply:* ' + nf.format(Math.round(cpriceobj[0].total_supply)) +
            '\n*Max Supply:* N/A' +
            '\n*Diluted Valuation:* N/A' +
            '\n*ROI:* ' + nf.format(Math.round((cpriceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';
            details = available + missing;

          }
          bot.sendChatAction(msg.chat.id, 'typing');
          bot.sendPhoto(msg.chat.id, cpriceobj[0].image, {caption: details, parse_mode: 'Markdown'});
            cid = null;
            csymbol = null;
        });
      }  else {
            bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(4) + '" in the database.');
          }
        }

        //     bot.sendChatAction(msg.chat.id, 'typing');
        //     bot.sendPhoto(msg.chat.id, cpriceobj[0].image, {caption: details + '\n' + today, "reply_markup": {"inline_keyboard": [[{text: 'Update', callback_data: msg.chat.id + ',' + msg.message_id + ',' + csymbol}]]}, parse_mode: 'Markdown'});
        //     msgid = msg.message_id + 1;
        //     console.log('og: ' + msg.chat.id + "," + msg.message_id + "," + msgid);
        //     // //  console.log(msgid);
        //     msgsymbol[msgid] = csymbol;
        //
        //
        //     bot.on("callback_query", (example) => {
        //     //  var action = new example.data;
        //       var action = example.data.split(',')
        //       var testsymb = action[2];
        //       var testmid = parseInt(action[1]) + 1;
        //       var testcid = parseInt(action[0]);
        //
        //         console.log(testmid, example.message.message_id, testsymb, csymbol);
        //         //bot.editMessageCaption('', {chat_id: example.message.chat.id, message_id: example.message.message_id});
        //         if (testsymb == csymbol && example.message.message_id == testmid) {
        //
        //         GetCoin();
        //         UpdatePrice();
        //         bot.answerCallbackQuery(example.id)
        //         .then (function (update) {
        //         bot.editMessageCaption(newcap + '\n' + today, {chat_id: testcid, message_id: testmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data: msg.chat.id + ',' + msg.message_id + ',' + csymbol }]]}});
        //       });
        //     } else {
        //         csymbol = testsymb;
        //         testmid = (msg.message_id) + 1;
        //         GetCoin();
        //         UpdatePrice();
        //         bot.answerCallbackQuery(example.id)
        //         .then (function (update) {
        //         bot.editMessageCaption(newcap + '\n' + today, {chat_id: testcid, message_id: testmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data: msg.chat.id + ',' + msg.message_id + ',' + csymbol }]]}});
        //       })}
        //       })
        //
        //
        //   });
        // }  else {
        //       bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(4) + '" in the database.');
        //     }
        //   }

          // var action = [];
          // var actionid = [];
          // var edtmid = [];
          // var edtcid = [];
          // var newmid = []
          // bot.on("callback_query", (example) => {
          //   console.log('data ' + example.data)
          //   if(action.indexOf(example.data) === -1) {
          //     action.push(example.data)
          //     actionid.push(example.id);
          // } else {
          //   const index = action.findIndex(arritem => arritem === example.data);
          //   action[index] = example.data;
          //   actionid[index] = example.id;
          //
          // }
          // console.log(action);
          // console.log(actionid);
          //   // action.push(example.data);
          //   // actionid.push(example.id);
          //   // console.log(action);
          //   // console.log(actionid);
          //   for (var i = 0; i < action.length; i++) {
          //     edtprms = action[i].split(',');
          //     console.log(edtprms);
          //     //console.log(example.data);
          //     edtmid = parseInt(edtprms[1]) + 1;
          //     edtcid = parseInt(edtprms[0]);
          //     csymbol = msgsymbol[edtprms[1]];
          //     console.log(csymbol);
          //     var newmid = parseInt(edtprms[1]);
          //     //console.log('new: ' + edtcid + ',' + newmid)
          //     GetCoin();
          //     UpdatePrice();
          //     bot.answerCallbackQuery(actionid[i])
          //     .then (() => bot.editMessageCaption(details + '\n' + today, {chat_id: edtcid, message_id: edtmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data:edtcid + "," + edtmid}]]}}));
          //   }

          //   if (msg.message_id == newmid) {
          //
          // } else {
          //   //newmid = msg.message_id;
          //   var oldmid = msg.message_id + 1;
          //   console.log('else: ' + edtcid + ',' + newmid)
          //   bot.answerCallbackQuery(example.id)
          //   .then (() => bot.editMessageCaption(details + '\n' + today, {chat_id: edtcid, message_id: oldmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data:edtcid + "," + msg.message_id}]]}}));
          // }
        //  })





        //   edtprms = action.split(',');
        //
        //   edtmid = parseInt(edtprms[1]) + 1;
        //   edtcid = parseInt(edtprms[0]);
        //   csymbol = msgsymbol[edtprms[1]];
        //   var newmid = parseInt(edtprms[1]);
        //   console.log('new: ' + edtcid + ',' + newmid)
        //   GetCoin();
        //   UpdatePrice();
        //   if (msg.message_id == newmid) {
        //   console.log('match');
        //   bot.answerCallbackQuery(example.id)
        //
        // } else {
        //   console.log('mismatch');
        //   var newmid = msg.message_id;
        //   var oldmid = msg.message_id + 1;
        //   console.log('else: ' + edtcid + ',' + newmid)
        //   bot.answerCallbackQuery(example.id)
        //   .then (() => bot.editMessageCaption(details + '\n' + today, {chat_id: edtcid, message_id: oldmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data:msg.chat_id + "," + msg.message_id}]]}}));
        // }




          //WORKS

          // bot.on("callback_query", (example) => {
          //   var action = example.data;
          //   edtprms = action.split(',');
          //   console.log(example.data);
          //   edtmid = parseInt(edtprms[1]) + 1;
          //   edtcid = parseInt(edtprms[0]);
          //   csymbol = msgsymbol[edtprms[1]];
          //   var newmid = parseInt(edtprms[1]);
          //   console.log('new: ' + edtcid + ',' + newmid)
          //   GetCoin();
          //   UpdatePrice();
          //   if (msg.message_id == newmid) {
          //   bot.answerCallbackQuery(example.id)
          //   .then (() => bot.editMessageCaption(details + '\n' + today, {chat_id: edtcid, message_id: edtmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data:edtcid + "," + newmid}]]}}));
          // } else {
          //   //newmid = msg.message_id;
          //   var oldmid = msg.message_id + 1;
          //   console.log('else: ' + edtcid + ',' + newmid)
          //   bot.answerCallbackQuery(example.id)
          //   .then (() => bot.editMessageCaption(details + '\n' + today, {chat_id: edtcid, message_id: oldmid, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'Update', callback_data:edtcid + "," + msg.message_id}]]}}));
          // }
          // })




            // //const msg = example.message;
            // console.log(example.message.message_id);
            // if (example.message.message_id == (msgid + 1)) {
            //   console.log('match');
            //   bot.answerCallbackQuery(example.id)
            //   .then (function(update){
            //     //console.log(msgsymbol[example.message.message_id - 1]);
            //     csymbol = msgsymbol[example.message.message_id - 1];
            //     GetCoin();
            //     UpdatePrice();
            //     bot.editMessageCaption(details + '\n' + today, {chat_id: example.message.chat.id, message_id: example.message.message_id, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'test', callback_data: 'click'}]]}});
            //     // cid = null;
            //     // csymbol = null;
            //   })
            // } else {
            //   bot.answerCallbackQuery(example.id)
            //   .then (function(update){
            //   msgid = test[1];
            //   console.log('msgid' + test[1]);
            //   console.log('chid' + test[0]);
            //   csymbol = msgsymbol[test[1]];
            //   console.log('sym' + csymbol);
            //   GetCoin();
            //   UpdatePrice();
            //   bot.editMessageCaption(details + '\n' + today, {chat_id: test[0], message_id: test[1], parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'test', callback_data: 'click'}]]}});
            // })}
            //  var btnmsg = callbackQuery.message;
            // console.log(callbackQuery.id);
            //   bot.answerCallbackQuery(callbackQuery.id)
            //       .then(function(update) {
            //     //    console.log(lastcsymbol);
            //         //var test = callbackQuery.message.message_id - 1;
            //         //console.log(test);
            //         // csymbol = msgsymbol[test];
            //         console.log(msgsymbol[callbackQuery.message.message_id - 1]);
            //         // GetCoin();
            //         // UpdatePrice();
            //         // bot.editMessageCaption(details + '\n' + today, {chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id, inline_message_id: callbackQuery.message.inline_message_id, parse_mode: 'Markdown', reply_markup: {inline_keyboard: [[{text: 'test', callback_data: 'click'}]]}});
            //         // cid = null;
            //         // csymbol = null;
            //       })
        //  });


// //UPDATE PRICE
//     var newcap;
//           function UpdatePrice() {
//           //   msgid = edtmid;
//           // //  console.log(msgid);
//           //   msgsymbol[msgid] = csymbol;
//                     axios.get(geckoAPI + '/coins/markets?vs_currency=usd&ids=' + cid +'&order=market_cap_desc&per_page=100&page=1&sparkline=false')
//                     .then(function (response) {
//                       cpriceobj = response.data;
//                       available =
//                       '*' + cpriceobj[0].name + '*' +
//                       '\n*Rank:* #' + cpriceobj[0].market_cap_rank +
//                       '\n*Price:* $' + nf.format(Math.round((cpriceobj[0].current_price + Number.EPSILON) * 100) / 100) +
//                       '\n*Market Cap:* $' + nf.format(Math.round(cpriceobj[0].market_cap)) +
//                       '\n*24h Volume:* $' + nf.format(Math.round(cpriceobj[0].total_volume)) +
//                       '\n*24h High:* $' + nf.format(Math.round((cpriceobj[0].high_24h + Number.EPSILON) * 100) / 100) +
//                       '\n*24h Low:* $' + nf.format(Math.round((cpriceobj[0].low_24h + Number.EPSILON) * 100) / 100) +
//                       '\n*24h Change:* $' + nf.format(Math.round((cpriceobj[0].price_change_24h + Number.EPSILON) * 100) / 100) +
//                       '\n*24h Change:* ' + nf.format(Math.round((cpriceobj[0].price_change_percentage_24h + Number.EPSILON) * 100) / 100) + '%' +
//                       '\n*ATH: $*' + nf.format(Math.round((cpriceobj[0].ath + Number.EPSILON) * 100) / 100) +
//                       '\n*ATH Difference:* ' + nf.format(Math.round((cpriceobj[0].ath_change_percentage + Number.EPSILON) * 100) / 100) + '%' +
//                       '\n*ATL:* $' + nf.format(Math.round((cpriceobj[0].atl + Number.EPSILON) * 100) / 100) +
//                       '\n*ATL Difference:* ' + nf.format(Math.round((cpriceobj[0].atl_change_percentage + Number.EPSILON) * 100) / 100) + '%' +
//                       '\n*Circulating:* ' + nf.format(Math.round(cpriceobj[0].circulating_supply));
//
//                       if (cpriceobj[0].roi != null && cpriceobj[0].total_supply != null && cpriceobj[0].max_supply != null && cpriceobj[0].fully_diluted_valuation != null) {
//                       missing =
//                       '\n*Total Supply:* ' + nf.format(Math.round(cpriceobj[0].total_supply)) +
//                       '\n*Max Supply:* ' + nf.format(Math.round(cpriceobj[0].max_supply)) +
//                       '\n*Diluted Valuation:* $' + nf.format(Math.round(cpriceobj[0].fully_diluted_valuation)) +
//                       '\n*ROI:* ' + nf.format(Math.round((cpriceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';
//
//                       details = available + missing;
//
//                     } else if (cpriceobj[0].total_supply == null && cpriceobj[0].max_supply == null && cpriceobj[0].fully_diluted_valuation == null) {
//                       missing =
//                       '\n*Total Supply:* N/A' +
//                       '\n*Max Supply:* N/A' +
//                       '\n*Diluted Valuation:* N/A' +
//                       '\n*ROI:* ' + nf.format(Math.round((cpriceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';
//
//                       details = available + missing;
//
//                     } else if (cpriceobj[0].roi == null) {
//                       missing =
//                       '\n*Total Supply:* ' + nf.format(Math.round(cpriceobj[0].total_supply)) +
//                       '\n*Max Supply:* ' + nf.format(Math.round(cpriceobj[0].max_supply)) +
//                       '\n*Diluted Valuation:* $' + nf.format(Math.round(cpriceobj[0].fully_diluted_valuation)) +
//                       '\n*ROI:* N/A';
//
//                       details = available + missing;
//
//                     } else if (cpriceobj[0].max_supply == null && cpriceobj[0].fully_diluted_valuation == null) {
//                       missing =
//                       '\n*Total Supply:* ' + nf.format(Math.round(cpriceobj[0].total_supply)) +
//                       '\n*Max Supply:* N/A' +
//                       '\n*Diluted Valuation:* N/A' +
//                       '\n*ROI:* ' + nf.format(Math.round((cpriceobj[0].roi.percentage + Number.EPSILON) * 100) / 100) + '%';
//
//                       details = available + missing;
//
//                     }
//
//
//                     });
//                     newcap = details;
//                     // cid = null;
//                     // csymbol = null;
//                     }


//GET CHART

function GetChart(){
            if (cfound) {
                axios.get(geckoAPI + '/coins/' + cid +'/market_chart/range?vs_currency=usd' + chartURL)
                .then(function (response) {
                  var priceobj = response.data.prices;
                  var mcapobj = response.data.market_caps;
                  var volobj = response.data.total_volumes;
                  var xval = [];
                  var yval = [];
                  var mval = [];
                  var vval = [];
                  var tval = [];
                  var dval = [];
                  var nmaval = [];
                  var pmaval = [];
                  var cleanval = [];
                  var tdval = [];
                  for (var i = 0; i < priceobj.length; i = i + timeMP) {
                    xval[i] = priceobj[i][0];
                    yval[i] = priceobj[i][1];
                    mval[i] = mcapobj[i][1].toFixed(2);
                    vval[i] = volobj[i][1].toFixed(2);
                  }

                  xval = xval.filter(function () { return true });
                  for (var i = 0; i < xval.length; i++) {
                    dval[i] = new Date(xval[i]).toLocaleDateString('en-GB' , { month: 'numeric', day: 'numeric' });
                    if (xMins && xHrs && !xHrsDays && !xDays) {
                      tval[i] = new Date(xval[i]).toLocaleTimeString('en-US' , { hour: '2-digit', minute: '2-digit' });
                      tdval[i] = tval[i];
                    } else if (!xMins && xHrs && !xHrsDays && !xDays) {
                      tval[i] = new Date(xval[i]).toLocaleTimeString('en-US' , { hour: '2-digit' });
                      tdval[i] = tval[i];
                    } else if (!xMins && !xHrs && xHrsDays && !xDays){
                      tval[i] = new Date(xval[i]).toLocaleTimeString('en-US' , { hour: '2-digit' });
                      tdval[i] = dval[i] + ': ' + tval[i];
                    } else if (!xMins && !xHrs && !xHrsDays && xDays) {
                      tval[i] = new Date(xval[i]).toLocaleTimeString('en-US' , { hour: '2-digit' });
                      tdval[i] = dval[i];
                    }
                  }
                  yval = yval.filter(function () { return true });
                  mval = mval.filter(function () { return true });
                  vval = vval.filter(function () { return true });

                    //SET CHART CONFIG

                     var myChart = new ChartJsImage();
                     myChart.setConfig({
                       title: {
                         display: false,
                         text: csymbol.toUpperCase(),
                       },
                       type: 'line',
                       data: {
                         labels: tdval,
                         datasets: [{
                           label: ' Price: $' + Number(yval[yval.length - 1]).toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short'}) + "     ",
                           data: yval,
                           pointStyle: 'line',
                           borderJoinStyle: 'round',
                           borderCapStyle: 'cap',
                           borderColor: 'rgba(0, 0, 200, 0.5)',
                           backgroundColor: 'rgba(0, 0, 200, 0.1)',
                           fill: true,
                           yAxisID: 'y-axis-2',
                           tension: 1,
                           order: 0,
                         },{
                         //   label: ' Mcap: $' + Number(mval[mval.length - 1]).toLocaleString('en-US', {
                         //   notation: 'compact',
                         //   hidden: false,
                         //   compactDisplay: 'short',
                         // }) + "     ",
                         //   type: 'bar',
                         //   data: mval,
                         //   borderColor: 'rgba(0, 200, 0, 0.9)',
                         //   backgroundColor: 'rgba(0, 200, 0, 0.7)',
                         //   fill: true,
                         //   grouped: false,
                         //   yAxisID: 'y-axis-1',
                         //   barThickness: 'flex',
                         //   categoryPercentage: 1,
                         //   barPercentage: 0.7,
                         // },{
                           label: ' Volume: $' + Number(vval[vval.length - 1]).toLocaleString('en-US', {
                           notation: 'compact',
                           compactDisplay: 'short',
                         }) + "     ",
                           type: 'bar',
                           data: vval,
                           borderColor: 'rgba(0, 200, 0, 0.9)',
                           backgroundColor: 'rgba(0, 200, 0, 0.7)',
                           fill: true,
                           order: 1,
                           grouped: false,
                           //minBarLength: 100,
                           yAxisID: 'y-axis-1',
                           barThickness: 'flex',
                           categoryPercentage: 1,
                           barPercentage: 0.7,
                         }]
                       }, options: {
                         title: {
                           display: true,
                           text: (cid.toUpperCase() + " (" + csymbol.toUpperCase() + ")" + cptimeframe),
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
                           xAxes: [{
                             id: 'x-axis-1',
                             type: 'category',
                             bounds: 'ticks',
                             position: 'bottom',
                             padding: 5,
                             beginAtZero: true,
                             ticks: {
                               autoSkip: true,
                               maxTicksLimit: 30,
                             },
                             grid: {
                               offset: true,
                             },
                             gridLines: {
                               offset: true,
                             },
                           }],
                           yAxes: [{
                             ticks: {
                               autoSkip: true,
                               maxTicksLimit: 8,
                               callback: function(value, index, values) {
                                   return value.toLocaleString('en-US', {
                                   notation: 'compact',
                                   compactDisplay: 'short',
                                   maximumFractionDigits: 8,
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
                               maxTicksLimit: 8,
                             callback: function(value, index, values) {
                                 return value.toLocaleString('en-US', {
                                 notation: 'compact',
                                 compactDisplay: 'short',
                                 maximumFractionDigits: 8,
                               })
                             }},
                             id: 'y-axis-2',
                            type: 'linear',
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
                    // }

                     //RENDER CHART AND SEND TO CHAT

                    myChart.toFile('mychart.png');
                    bot.sendChatAction(msg.chat.id, 'typing');
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
                  }, 3500);

                  cid = null;
                  csymbol = null;
                });
              }  else {
                    bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(4) + '" in the database.');
                  }
                }

                //GET CHART

                function GetCandleChart(){
                            if (cfound) {
                                axios.get(geckoAPI + '/coins/' + cid + '/ohlc?vs_currency=usd&' + chartURL)
                                .then(function (response) {
                                  var priceobj = response.data;
                                  var tval = [];
                                  var dval = [];
                                  var tdval = [];
                                  var pmaval = [];
                                  var nmaval = [];
                                  var stddevval = [];
                                  var bolu = [];
                                  var bolb = [];
                                  var typprice = [];
                                  var highval = [];
                                  var lowval = [];
                                  var openval = [];
                                  var closeval = [];
                                  var uptick = [];
                                  var bottick = [];
                                  var upsup = [];
                                  var botsup = [];
                                  var avgcan = [];
                                  var amplitude = [];
                                  var absavg = [];
                                  var highavg = [];
                                  var lowavg = [];
                                  var rs = [];
                                  var rsi = [];
                                  var rsiavg = [];
                                  var rsihvg = [];
                                  var rsilvg = [];
                                  var lowtick = [];



                                  for (var i = 0; i < priceobj.length - 1; i++) {
                                    tval[i] = new Date(priceobj[i][0]).toLocaleTimeString('en-US' , { hour: '2-digit' });
                                    dval[i] = new Date(priceobj[i][0]).toLocaleDateString('en-GB' , { month: 'numeric', day: 'numeric' });
                                    if (xHrs && !xHrsDays && !xDays) {
                                      tdval[i] = tval[i];
                                    } else if (!xHrs && xHrsDays && !xDays){
                                      tdval[i] = dval[i] + ': ' + tval[i];
                                    } else if (!xHrs && !xHrsDays && xDays) {
                                      tdval[i] = dval[i];
                                    }
                                    highval[i] = priceobj[i][2];
                                    lowval[i] = priceobj[i][3];
                                    openval[i] = priceobj[i][1];
                                    closeval[i] = priceobj[i][4];





                                    if (i - Math.round((priceobj.length - 1) * tmamp) >= 0) {
                                      nmaval[i] = (priceobj[i - Math.round((priceobj.length - 1) * tmamp)][2] + priceobj[i - Math.round((priceobj.length - 1) * tmamp)][3] + priceobj[i - Math.round((priceobj.length - 1) * tmamp)][4]) / 3;
                                    } else {
                                      nmaval[i] = ((priceobj[i][2] + priceobj[i][3] + priceobj[i][4]) + math.std(priceobj[i][2], priceobj[i][3], priceobj[i][4]) * tmamp) / 3;
                                    }
                                    if (i - Math.round((priceobj.length - 1) * fmamp) >= 0) {
                                      pmaval[i] = (priceobj[i - Math.round((priceobj.length - 1) * fmamp)][2] + priceobj[i - Math.round((priceobj.length - 1) * fmamp)][3] + priceobj[i - Math.round((priceobj.length - 1) * fmamp)][4]) / 3;
                                    } else {
                                      pmaval[i] = ((priceobj[i][2] + priceobj[i][3] + priceobj[i][4]) - math.std(priceobj[i][2], priceobj[i][3], priceobj[i][4]) * fmamp) / 3;
                                    }

                                      //BOLLINGER BANDS
                                      typprice[i] = (priceobj[i][2] + priceobj[i][3] + priceobj[i][4]) / 3;
                                      stddevval[i] = math.std(priceobj[i][2], priceobj[i][3], priceobj[i][4]);
                                      bolu[i] = typprice[i] + 2 * stddevval[i];
                                      bolb[i] = typprice[i] - 2* stddevval[i];

                                      avgcan[i] = (openval[i] + closeval[i]) / 2;
                                      uptick[i] = highval[i] - avgcan[i];
                                      amplitude[i] = highval[i] - lowval[i];
                                  //    upsup[i] = highval[i] - uptick[i];
                                      bottick[i] = avgcan[i] - lowval[i];
                                    //  botsup[i] = lowval[i] - bottick[i];
                                       absavg[i] = math.std(amplitude[i], uptick[i], highval[i], avgcan[i], bottick[i], lowval[i]);
                                       lowavg[i] = absavg[i] - Math.min(amplitude[i], uptick[i], highval[i], avgcan[i], bottick[i], lowval[i]);
                                       highavg[i] = Math.max(amplitude[i], uptick[i], highval[i], avgcan[i], bottick[i], lowval[i]) - absavg[i];

                                       rs[i] = highavg[i] / lowavg[i];
                                       rsi[i] = (100 - (100 / 1 + rs[i])) * 100;
                                       rsiavg[i] = absavg[i] + rsi[i] * absavg[i];
                                       rsihvg[i] = rsiavg[i] + rsi[i] * highavg[i];
                                       rsilvg[i] = rsiavg[i] - rsi[i] * lowavg[i];
                                    // console.log(rsi + ' ' + rsiavg + ' ' + rsihvg + ' ' + rsilvg);
                                       lowtick[i] = amplitude[i] + rsilvg[i]

                          //              100
                          // RSI = 100 - --------
                          //              1 + RS
                          //
                          // RS = Average Gain / Average Loss

                                       //console.log('avg:' + absavg[i] + 'l:' + lowavg[i] + 'h:' + highavg[i]);
                                       //console.log(amplitude[i], uptick[i], highval[i], avgcan[i], bottick[i], lowval[i], absavg[i], lowavg[i], highavg[i]);
                                    //SET CHART CONFIG

                                     var myChart = new ChartJsImage();

                                     var cptitle = (cid.toUpperCase() + " (" + csymbol.toUpperCase() + "): " + cptimeframe);
                                     myChart.setConfig({
                                       title: {
                                         display: true,
                                         text: cptitle,
                                       },
                                       type: 'line',
                                       data: {
                                         labels: tdval,
                                         datasets: [{
                                           label: ' Price: $' + Number(closeval[i]).toLocaleString('en-US', {
                                           notation: 'compact',
                                           compactDisplay: 'short',
                                         }) + "     ",
                                           data: avgcan,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           stepped: true,
                                           borderWidth: 3,
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           fill: false,
                                           showLine: true,
                                           borderColor: 'rgba(0, 0, 0, 1)',
                                           backgroundColor: 'rgba(0, 0, 0, 1)',
                                           yAxisID: 'y-axis-1',
                                           tension: 0,
                                         },{
                                           id: 'maslow',
                                           label: ' MA: SLOW ',
                                           type: 'line',
                                           data: nmaval,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           borderWidth: 2,
                                           fill: false,
                                           //borderDash: [4,4],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(255, 0, 0, 1)',
                                           backgroundColor: 'rgba(255, 0, 0, 1)',

                                           yAxisID: 'y-axis-1',
                                           tension: 0.1,
                                         },{
                                           id: 'mafast',
                                           label: ' MA: FAST ',
                                           type: 'line',
                                           data: pmaval,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           borderWidth: 2,
                                           fill: false,
                                           //borderDash: [4,4],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(77, 5, 232, 1)',
                                           backgroundColor: 'rgba(77, 5, 232, 1)',
                                           yAxisID: 'y-axis-1',
                                           tension: 0.1,
                                         },{
                                           id: 'bolb',
                                           label: ' BOLB ',
                                           type: 'line',
                                           data: bolb,
                                           hidden: false,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           borderWidth: 0,
                                           fill: '+1',
                                        // borderDash: [4,1],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(0, 0, 200, 0.1)',
                                           backgroundColor: 'rgba(0, 0, 200, 0.1)',

                                           yAxisID: 'y-axis-1',
                                           tension: 10,
                                         },{
                                           id: 'bolu',
                                           label: ' BOLU ',
                                           type: 'line',
                                           data: bolu,
                                           hidden: false,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           borderWidth: 0,
                                           fill: '-1',
                                        // borderDash: [4,1],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(0, 0, 200, 0)',
                                           backgroundColor: 'rgba(0, 0, 200, 0.1)',
                                           yAxisID: 'y-axis-1',
                                           tension: 0,
                                         },{
                                             type: 'line',
                                             id: 'rsi',
                                             label: ' RSI: ',
                                             data: rsi,
                                             pointRadius: 2,
                                             pointStyle: 'line',
                                             stepped: true,
                                             borderWidth: 2,
                                             borderJoinStyle: 'round',
                                             borderCapStyle: 'cap',
                                             fill: true,
                                             showLine: true,
                                             borderColor: 'rgba(255, 255, 255, 1)',
                                             backgroundColor: 'rgba(255, 255, 255, 1)',
                                             yAxisID: 'y-axis-2',
                                             tension: 1,
                                           },{
                                           id: 'topWicksSup',
                                           label: ' TWS ',
                                           type: 'bar',
                                           display: false,
                                           data: absavg,
                                           //base: barval,
                                           borderWidth: 3,
                                           borderColor: 'rgba(155, 0 , 0, 0.2)',
                                           backgroundColor: 'rgba(155, 0, 0, 0.2)',
                                           grouped: false,
                                           yAxisID: 'y-axis-3',
                                           xAxisID: 'x-axis-1',
                                         },{
                                           id: 'topWicks',
                                           label: ' TW ',
                                           display: false,
                                           type: 'bar',
                                           showLine: false,
                                           data:  highavg,
                                           //base: 30,
                                           pointRadius: 3,
                                           pointStyle: 'line',
                                           borderWidth: 3,
                                        //   fill: '-1',
                                        // borderDash: [4,1],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(155, 100, 0, 0.2)',
                                           backgroundColor: 'rgba(155, 100, 0, 0.2)',
                                           grouped: false,
                                           yAxisID: 'y-axis-3',
                                           xAxisID: 'x-axis-1',
                                           tension: 0.1,
                                         },{
                                           id: 'botWickSup',
                                           label: ' BWS ',
                                           type: 'bar',
                                           display: false,
                                           data: lowtick,
                                           //base: barval,
                                           borderWidth: 3,
                                           borderColor: 'rgba(100, 155, 0, 0.2)',
                                           backgroundColor: 'rgba(100, 155, 0, 0.2)',
                                           grouped: true,
                                           yAxisID: 'y-axis-3',
                                           xAxisID: 'x-axis-1',
                                         },{
                                           id: 'botWick',
                                           label: ' BW ',
                                           display: false,
                                           type: 'bar',
                                           showLine: false,
                                           data: lowavg ,
                                           //base: 30,
                                           pointRadius: 3,
                                           pointStyle: 'line',
                                           borderWidth: 3,
                                          // fill: '-1',
                                        // borderDash: [4,1],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(0, 155, 0, 0.2)',
                                           backgroundColor: 'rgba(0, 155, 0, 0.2)',
                                           grouped: true,
                                           yAxisID: 'y-axis-3',
                                           xAxisID: 'x-axis-1',
                                           tension: 0.1,
                                         }]
                                       }, options: {

                                         devicePixelRatio: 5,
                                         title: {
                                           display: true,
                                           text: (cid.toUpperCase() + " (" + csymbol.toUpperCase() + "): " + cptimeframe),
                                           position: 'top',
                                         },
                                         layout: {

                                           padding: 5,
                                         },
                                         legend: {

                                           labels: {
                                             filter: function(legendItem, chartData) {
                                                  return legendItem.datasetIndex < 3
                                             },
                                             padding: 5,
                                           }
                                         },
                                         padding: 5,
                                         responsive:true,
                                         maintainAspectRatio: true,
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
                                           xAxes: [{
                                             id: 'x-axis-1',
                                             ticks: {
                                               autoSkip: true,
                                               maxTicksLimit: 16,
                                             },
                                             type: 'category',
                                             bounds: 'ticks',
                                             position: 'bottom',
                                             padding: 5,
                                                 stacked: true,
                                             beginAtZero: false,
                                             grid: {
                                               offset: false,
                                             },
                                             gridLines: {
                                               offset: false,
                                             },
                                           },{
                                             id: 'x-axis-2',
                                             ticks: {
                                               autoSkip: true,
                                               maxTicksLimit: 16,
                                             },
                                             display: false,
                                             type: 'category',
                                             bounds: 'ticks',
                                             position: 'bottom',
                                             padding: 5,
                                             beginAtZero: false,
                                             grid: {
                                               offset: false,
                                             },
                                             gridLines: {
                                               offset: false,
                                             },
                                           }],
                                           yAxes: [{
                                             ticks: {
                                               autoSkip: true,
                                               maxTicksLimit: 8,
                                               callback: function(value, index, values) {
                                                   return value.toLocaleString('en-US', {
                                                   notation: 'compact',
                                                   compactDisplay: 'short',
                                                   maximumFractionDigits: 8,
                                                 })
                                               }},
                                             id: 'y-axis-1',
                                             ticks: {
                                               autoSkip: true,
                                               maxTicksLimit: 8,
                                               callback: function(value, index, values) {
                                                   return value.toLocaleString('en-US', {
                                                   notation: 'compact',
                                                   compactDisplay: 'short',
                                                   maximumFractionDigits: 8,
                                                 })
                                               }},
                                             bounds: 'data',
                                             type: 'linear',
                                             position: 'left',
                                             padding: 5,
                                             beginAtZero: false,
                                             display: true,
                                             grid: {
                                              offset: true,
                                            },
                                             gridLines: {
                                              offset: true,
                                            }
                                          },{
                                          id: 'y-axis-2',
                                          bounds: 'data',
                                          type: 'logarithmic',
                                          stacked: false,
                                          position: 'center',
                                          padding: 5,
                                          beginAtZero: true,
                                          display: false,
                                          grid: {
                                           offset: false,
                                         },
                                          gridLines: {
                                           offset: false,
                                         }},{
                                         id: 'y-axis-3',
                                         bounds: 'data',
                                         type: 'logarithmic',
                                         stacked: true,
                                         position: 'right',
                                         padding: 5,
                                         beginAtZero: false,
                                         display: false,
                                         grid: {
                                          offset: false,
                                        },
                                         gridLines: {
                                          offset: false,
                                        }}]
                                         }
                                       }
                                     });

                                     myChart.setWidth(512).setHeight(512).setBackgroundColor('transparent');
                                     }

                                     //RENDER CHART AND SEND TO CHAT

                                    myChart.toFile('mychart.jpg');
                                    bot.sendChatAction(msg.chat.id, 'typing');
                                    setTimeout(function () {
                                    bot.sendPhoto(msg.chat.id, 'mychart.jpg');
                                    }, 2500);
                                    setTimeout(function () {
                                      if (fs.existsSync('mychart.jpg')) {
                                      fs.unlink('mychart.jpg', (err) => {
                                          if (err) {
                                              throw err;
                                          }

                                          console.log("File is deleted.");
                                      });
                                    }
                                  }, 3500);

                                  cid = null;
                                  csymbol = null;
                                });
                              }  else {
                                    bot.sendMessage(msg.chat.id, 'Cannot find "' + msg.text.substr(4) + '" in the database.');
                                  }
                                }

  });
