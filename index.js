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
const wojakPage = 'https://www.wojakindex.biz/';
const wojakIndex = 'https://api.wojakindex.biz/current_wojak_index.json';
const wojakImgs = 'https://api.wojakindex.biz/pink_wojaks.json';
const wImageUrl = 'https://i.4cdn.org/biz/';
const bizThread = 'http://boards.4chan.org/biz/thread/';
const bizAPI = 'https://a.4cdn.org/biz/threads.json';
const threadAPI = 'https://a.4cdn.org/biz/thread/';
const math = require('mathjs');
const coverGlo = 'media/global.gif';
const coverDefi = 'media/defi.gif';
const coverHelp = 'media/help.gif';
const coverHot = 'media/hot.gif';
const coverBog = ['media/bog1.gif', 'media/bog2.gif', 'media/bog3.gif', 'media/bog4.gif', 'media/bog5.gif'];

//KEY TIMEFRAMES IN UNIX
var minute = 60;
var hour = 3600;
var day = 86400;
var week = 604800;
var month = 2592000;
var today = Math.round((new Date()).getTime() / 1000);

var cid;
var csymbol;
var coinsList;
var cprice;
var tdata;
var imgfile;
var chartURL;
var tmamp = 0.182648401826484; //200 DAY AVERAGE RATIO
var fmamp = 0.045662100456621; //50 DAY AVERAGE RATIO
var xHrs = false; //DISPLAY HOURS ONLY
var xHrsDays = false; //DISPLAY HOURS & DAYS
var xDays = false; //DISPLAYS DAYS


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
  var uniMsg = msg.text.toLowerCase();
  csymbol = uniMsg.substr(3);


  //COIN INTERACTION COMMAND VARS
  var cInfo = "/i ";
  var cPrice = "/d ";
  var cMin = "/mn "//10min int 4h
  var cThrs = "/mh ";//2h int 12h
  var cHdy = "/mt ";//12h int 7days
  var cDay = "/md ";//24h int 30 days
  var cHwk = "/mw ";//3days int quarter
  var cMnt = "/mf ";//14day int year
  var cpHrs = "/ph ";//1h int 24h
  var cpDay = "/pd ";//1d int 14d
  var cpWks = "/pw ";//7d int 3mmt
  var cpHmt = "/pf ";//14d int 180d

  if (uniMsg.startsWith(cInfo)) {
    csymbol = uniMsg.substr(3);
    GetCoin();
    GetProjectInfo();
  } else if (uniMsg == cInfo.substr(0,2)) {
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
  }

  if (uniMsg.startsWith(cMin)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 4 * hour) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 1;
    cptimeframe = ': 4 Hours'
    GetCoin();
    GetChart();
  } else if (uniMsg == cMin.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 4 * hour) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 1;
    cptimeframe = ': 4 Hours'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(cThrs)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - day) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 7;
    cptimeframe = ': 12 Hours'
    GetCoin();
    GetChart();
  } else if (uniMsg == cThrs.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - day) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 7;
    cptimeframe = ': 24 Hours'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(cHdy)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - week) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 4;
    cptimeframe = ': 7 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == cHdy.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - week) + '&to=' + today;
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    timeMP = 4;
    cptimeframe = ': 7 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(cDay)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 15;
    cptimeframe = ': 30 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == cDay.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 15;
    cptimeframe = ': 30 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(cHwk)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 3 * month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 40;
    cptimeframe = ': 90 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == cHwk.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 3 * month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 40;
    cptimeframe = ': 90 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(cMnt)) {
    csymbol = uniMsg.substr(4);
    chartURL = '&from=' + (today - 12 * month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 7;
    cptimeframe = ': 365 Days'
    GetCoin();
    GetChart();
  } else if (uniMsg == cMnt.substr(0,3)) {
    csymbol = 'link';
    chartURL = '&from=' + (today - 12 * month) + '&to=' + today;
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    timeMP = 7;
    cptimeframe = ': 365 Days'
    GetCoin();
    GetChart();
  }

  if (uniMsg.startsWith(cpHrs)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=1';
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    cptimeframe = '24 Hours'
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == cpHrs.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=1';
    xHrs = true;
    xHrsDays = false;
    xDays = false;
    cptimeframe = '24 Hours'
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(cpDay)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=14';
    xHrs = false;
    xHrsDays = true;
    xDays = false;
    cptimeframe = '14 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == cpDay.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=14';
    xHrs = false;
    xHrsDays = true;
    xDays = false;
    cptimeframe = '14 Days';
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(cpHmt)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=90';
    xHrsMins = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '90 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == cpHmt.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=90';
    xHrsMins = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '90 Days';
    GetCoin();
    GetCandleChart();
  }

  if (uniMsg.startsWith(cpWks)) {
    csymbol = uniMsg.substr(4);
    chartURL = 'days=180';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '180 Days';
    GetCoin();
    GetCandleChart();
  } else if (uniMsg == cpWks.substr(0,3)) {
    csymbol = 'link';
    chartURL = 'days=180';
    xHrs = false;
    xHrsDays = false;
    xDays = true;
    cptimeframe = '180 Days';
    GetCoin();
    GetCandleChart();
  }


//GET HELP

if (uniMsg == "/help" || uniMsg == "/help@" + botuname) {
  bot.sendChatAction(msg.chat.id, 'typing');
  bot.sendAnimation(msg.chat.id, coverHelp, {caption :
    "*Available Commands:*" +
    "\n/i - Get coin information e.g. /c bitcoin" +
    "\n/d - Get coin market data e.g. /p ethereum" +
    "\n/m(t) - Get price & volume chart at t timeframe: Minutes /mn, Hours /mh, 12 Hours /mt, Day /md, Week /mw, Month /mm e.g. /mm xmr" +
    "\n/p(t) - Get price chart with indicators at t time interval: Hours /pd, Days /pb, Weeks /pw e.g. /pd link" +
    "\n/hot - Get the Top 7 Trending Coins on CoinGecko" +
    "\n/crypto - Get global crypto market data " +
    "\n/defi - Get global DeFi market data " +
    "\n/wjk - Get key metrics about the Wojak Index" +
    "\n/biz - Get a random popular thread on /biz/" +
    "\n/qt - Get a random crypto quote" +
    "\n/help - Get help on how to use my services"
  , parse_mode: 'Markdown'})};


//GET QUOTE
const quoteList =
["If you don’t believe it or don’t get it, I don’t have the time to try to convince you, sorry.\n – Satoshi Nakamoto",
"I see Bitcoin as ultimately becoming a reserve currency for banks, playing much the same role as gold did in the early days of banking. Banks could issue digital cash with greater anonymity and lighter weight, more efficient transactions.\n – Hal Finney",
'Any time a country transitioned to a fiat currency, they collapsed. That’s just world history; you don’t have to know about cryptocurrency to know that.\n– Nipsey Hussle',
'If the cryptocurrency market overall or a digital asset is solving a problem, it’s going to drive some value.\n –  Brad Garlinghouse',
'Whenever the price of cryptocurrency is rallying, people start spending a lot more.\n – Erik Voorhees',
'We are seeing more managed money and, to an extent, institutional money entering the [crypto] space. Anecdotally speaking, I know of many people who are working at hedge funds or other investment managers who are trading cryptocurrency personally, the question is, when do people start doing it with their firms and funds?\n – Olaf Carlson-Wee',
'I am very excited about the prospect of using cryptocurrency, not just as a money equivalent, but using it as a way to earn something as a result of doing some type of work.\n – William Mougayar',
'What value does cryptocurrency add? No one’s been able to answer that question to me.\n – Steve Eisman',
'Bitcoin is here to stay. There would be a hacker uproar to anyone who attempted to take credit for the patent of cryptocurrency. And I wouldn’t want to be on the receiving end of hacker fury.\n – Adam Draper',
'I am very intrigued by Bitcoin. It has all the signs. Paradigm shift, hackers love it, yet it is described as a toy. Just like microcomputers.\n – Paul Graham',
'Blockchain is the tech. Bitcoin is merely the first mainstream manifestation of its potential.\n – Marc Kenigsberg',
'As the value goes up, heads start to swivel and skeptics begin to soften. Starting a new currency is easy, anyone can do it. The trick is getting people to accept it because it is their use that gives the “money” value.\n – Adam B. Levine',
'Bitcoin will do to banks what email did to the postal industry\n – Rick Falkvinge',
'Bitcoin is a technological tour de force.\n – Bill Gates',
'Well, I think it is working. There may be other currencies like it that may be even better. But in the meantime, there’s a big industry around Bitcoin— People have made fortunes off Bitcoin, some have lost money. It is volatile, but people make money off of volatility too.\n – Richard Branson',
'[Bitcoin] is a remarkable cryptographic achievement… The ability to create something which is not duplicable in the digital world has enormous value…Lot’s of people will build businesses on top of that.\n – Eric Schmidt',
'PayPal had these goals of creating a new currency. We failed at that, and we just created a new payment system. I think Bitcoin has succeeded on the level of a new currency, but the payment system is somewhat lacking. It’s very hard to use, and that’s the big challenge on the Bitcoin side.\n – Peter Thiel',
'Bitcoin actually has the balance and incentives center, and that is why it is starting to take off.\n – Julian Assange',
'Bitcoin is the beginning of something great: a currency without a government, something necessary and imperative.\n – Nassim Taleb, Author and Risk Analyst',
'Bitcoin, and the ideas behind it, will be a disrupter to the traditional notions of currency. In the end, currency will be better for it.\n – Edmund Moy, 38th Director of the United States Mint',
'Right now Bitcoin feels like the Internet before the browser.\n – Wences Casares',
'[Bitcoin] is a very exciting development, it might lead to a world currency. I think over the next decade it will grow to become one of the most important ways to pay for things and transfer assets.\n – Kim Dotcom, CEO of MegaUpload',
'The Federal Reserve simply does not have authority to supervise or regulate Bitcoin in any way.\n – Janet Yellen, former chair of the US Federal Reserve',
'EVERY informed person needs to know about Bitcoin because it might be one of the world’s most important developments.\n – Leon Louw, two-time Nobel Peace Prize nominee',
'Bitcoin may be the TCP/IP of money.\n – Paul Buchheit',
'Whereas most technologies tend to automate workers on the periphery doing menial tasks, blockchains automate away the center. Instead of putting the taxi driver out of a job, blockchain puts Uber out of a job and lets the taxi drivers work with the customer directly.\n – Vitalik Buterin, co-founder of Ethereum',
'Cryptographical solutions might with great propriety be introduced into academies as the means of giving tone to the most important of the powers of the mind.\n – Edgar Allan Poe',
'It’s gold for nerds.\n – Stephan Colbert, Comedian',
'If [Bitcoin does] not [reach $500.000 by the end of 2020], I will eat my d*ck on national television.\n – John McAfee – founder McAfee antivirus',
'I understand the political ramifications of [bitcoin] and I think that the government should stay out of them and they should be perfectly legal.\n – Ron Paul, Republican Texas Congressman and former candidate for US President',
'I think the fact that within the bitcoin universe an algorithm replaces the functions of [the government] is actually pretty cool. I am a big fan of Bitcoin.\n – Al Gore, 45th Vice President of the United States',
'Cryptocurrency is such a powerful concept that it can almost overturn governments\n – Charles Lee, Creator of Litecoin',
'The reason we are all here is that the current financial system is outdated.\n – Charlie Shrem – founder & CEO Bitinstant',
'There are 3 eras of currency: Commodity based, politically based, and now, math-based.\n – Chris Dixon',
'At their core, cryptocurrencies are built around the principle of a universal, inviolable ledger, one that is made fully public and is constantly being verified by these high-powered computers, each essentially acting independently of the others.\n – Paul Vigna',
'I love seeing new services constantly starting to accept Bitcoin. Bitcoin is really becoming “the currency of the Internet.” I’m most concerned by possible government reactions to Bitcoin. They can’t destroy Bitcoin, but they could really slow things down by making exchange much more difficult.\n – Michael Marquardt',
'Bitcoin is Money Over Internet Protocol.\n – Tony Gallippi',
'If Satoshi had released Bitcoin 10 yrs. earlier, 9/11 would never have happened.\n – Max Keiser',
'One must acknowledge with cryptography no amount of violence will ever solve a math problem.\n – Jacob Appelbaum',
'At its core, bitcoin is a smart currency, designed by very forward-thinking engineers. It eliminates the need for banks, gets rid of credit card fees, currency exchange fees, money transfer fees, and reduces the need for lawyers in transitions… all good things\n – Peter Diamandis',
'When I first heard about Bitcoin, I thought it was impossible. How can you have a purely digital currency? Can’t I just copy your hard drive and have your bitcoins? I didn’t understand how that could be done, and then I looked into it and it was brilliant.\n – Jeff Garzik',
'The governments of the world have spent hundreds and hundreds of trillions of dollars bailing out a decaying, dickensian, outmoded system called banking when the solution to the future of finance is peer-to-peer. It’s going to be alternative currencies like Bitcoin and it’s not actually going to be a banking system as we had before 2008.\n – Patrick Young',
'We have elected to put our money and faith in a mathematical framework that is free of politics and human error.\n – Tyler Winklevoss',
'Hey, obviously this is a very interesting time to be in Bitcoin center now, but if you guys want to argue over whether this is reality or not, one Bitcoin will feed over 40 homeless people in Pensacola center now. If you guys want proof Bitcoin is real, send them to me, I’ll cash them out and feed homeless people.\n – Jason King',
'The bitcoin world is this new ecosystem where it doesn’t cost that much to start a new Bitcoin company, it doesn’t cost much to start owning Bitcoin either, and it is a much more efficient way of moving money around the world.\n – Tim Draper',
'Bitcoin enables certain uses that are very unique. I think it offers possibilities that no other currency allows. For example the ability to spend a coin that only occurs when two separate parties agree to spend the coin; with a third party that couldn’t run away with the coin itself.\n – Pieter Wuille',
'Bitcoin is Cash with Wings\n – Charlie Shrem',
'It was the amateurs of cryptology who created the species. The professionals, who almost certainly surpassed them in cryptanalytic expertise, concentrated on down-to-earth problems of the systems that were then in use but are now outdated. The amateurs, unfettered to those realities, soared into the empyrean of theory.\n – David Kahn',
'Bitcoin is the currency of resistance.\n – Max Keiser',
'What can’t kill Bitcoin, makes it stronger.\n – Mark Wittkowski',
'You should be taking this technology as seriously as you should have been taking the development of the Internet in the early 1990’s.\n – Blythe Masters',
'I think the internet is going to be one of the major forces for reducing the role of government. The one thing that’s missing but that will soon be developed is a reliable e-cash.\n –Milton Friedman',
'What affected me most profoundly was the realization that the sciences of cryptography and mathematics are very elegant, pure sciences. I found that the ends for which these pure sciences are used are less elegant.\n – Jim Sanborn',
'Cryptography is the essential building block of independence for organizations on the Internet, just like armies are the essential building blocks of states because otherwise one state just takes over another.\n – Julian Assange',
'Bitcoin was created to serve a highly political intent, a free and uncensored network where all can participate with equal access.\n – Amir Taaki',
'Lots of people working in cryptography have no deep concern with real application issues. They are trying to discover things clever enough to write papers about.\n – Whitfield Diffie',
'Trusted third parties are security holes.\n – Nick Szabo ',
'This [Bitcoin] may be the purest form of democracy the world has ever known, and I — for one — am thrilled to be here to watch it unfold.\n – Paco Ahlgren',
'Cryptography shifts the balance of power from those with a monopoly on violence to those who comprehend mathematics and security design.\n – Jacob Appelbaum',
'[Cryptourrencies] may hold long-term promise, particularly if the innovations promote a faster, more secure and more efficient payment system.\n –Ben Bernanke',
'Online identity and reputation will be decentralized. We will own the data that belongs to us.\n – William Mougayar',
'It just identifies how much money laundering there is being done in the world,” Fink said. “How much people are trying to move currencies from one place to another.\n –Larry Fink',
'Gold is a great way to preserve wealth, but it is hard to move around. You do need some kind of alternative and Bitcoin fits the bill. I’m not surprised to see that happening.\n – Jim Rickards',
'What we want is fully anonymous, ultra-low transaction cost, transferable units of exchange. If we get that going… the banks will become the obsolete dinosaurs they deserve to become.\n – Adam Back',
'The blockchain is an incorruptible digital ledger of economic transactions that can be programmed to record not just financial transactions but virtually everything of value.\n – Don & Alex Tapscott',
"[Bitcoin is] the biggest opportunity set we can think of over the next decade.\n – Bob Grifeld",
"Since we’re all rich with bitcoins … we ought to put some of this unearned wealth to good use.\n – Hal Finney",
"Bitcoin seems to be a very promising idea. I like the idea of basing security on the assumption that the CPU power of honest participants outweighs that of the attacker. It is a very modern notion that exploits the power of the long tail.\n – Hal Finney",
"The computer can be used as a tool to liberate and protect people, rather than to control them.\n – Hal Finney",
"Lost coins only make everyone else’s coins worth slightly more. Think of it as a donation to everyone.\n – Satoshi Nakamoto",
"Sigh… why delete a wallet instead of moving it aside and keeping the old copy just in case? You should never delete a wallet.\n – Satoshi Nakamoto",
"The possibility to be anonymous or pseudonymous relies on you not revealing any identifying information about yourself in connection with the bitcoin addresses you use. If you post your bitcoin address on the web, then you’re associating that address and any transactions with it with the name you posted under. If you posted under a handle that you haven’t associated with your real identity, then you’re still pseudonymous. For greater privacy, it’s best to use bitcoin addresses only once.\n – Satoshi Nakamoto",
"At the end of the day, Bitcoin is programmable money.\n– Andreas Antonopoulos",
"One of my favorite words is a French word: sousveillance. It is the opposite of surveillance. Surveillance means to look from above; sousveillance means to look from below.\n – Andreas Antonopoulos",
"Bitcoin experts argue that deflation is not bad per se. Rather, deflation is associated with a collapse in demand because that is the only example of deflation we have to study.\n – Andreas Antonopoulos",
"[Bitcoin is] worse than tulip bulbs\n – Jamie Dimon, CEO of JP Morgan",
"Stay away from it. It’s a mirage, basically. In terms of cryptocurrencies, generally, I can say almost with certainty that they will come to a bad ending.\n –  Warren Buffett, legendary investor",
"Bitcoin, and the ideas behind it, will be a disrupter to the traditional notions of currency. In the end, currency will be better for it. \n – Edmund Moy, 38th Director of the United States Mint",
"Bitcoin is evil.\n – Paul Krugman, Nobel-prize winning economist"

]

if (uniMsg == "/qt" || uniMsg == "/qt@" + botuname) {
bot.sendAnimation(msg.chat.id, coverBog[Math.round(Math.random(coverBog.length))], { caption: quoteList[Math.round(Math.random(quoteList.length))] });
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
    }
    thrimgurl = wImageUrl + threadobj.posts[thrsrchindex].tim + threadobj.posts[thrsrchindex].ext;
    bot.sendPhoto(msg.chat.id, thrimgurl, { caption: '*' + threadobj.posts[thrsrchindex].sub + '*:' +
    '\n' + threadobj.posts[thrsrchindex].com.replace(/<[^>]*>?/gm, '').substr(0, 500) + '...' +
    '\n' +
    '\n*' + threadobj.posts[thrsrchindex].replies + '* replies / *' + threadobj.posts[thrsrchindex].unique_ips + '* IDs: ' +
    '\n[Read Full Story on /biz/](' + threadurl + ')' , parse_mode: 'Markdown' });
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
    if (windex >= 400) {
      var reply = "Don't worry McDonald's is still hiring...";
    } else {
      var reply = "Panic levels are still within parameters.";
    }
    bot.sendPhoto(msg.chat.id, url, {
      caption: wexstr + '*' + windex + ' (' + wshare + '%)*'+
      '\n' + reply +
      '\n' + '[Visit Wojak Thread](' + bizurl + wothreadID + ') | [Browse Wojak Index](' + wojakPage + ')' , parse_mode: 'Markdown'
    });
    }))
    };

if (uniMsg == "/crypto" || uniMsg == "/crypto@" + botuname) {
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
  bot.sendChatAction(msg.chat.id, 'typing');
  bot.sendAnimation(msg.chat.id, coverGlo, { caption: '*Global Market Data - Crypto:*' +
  '\n*Total Coins:* ' + totalcoins +
  '\n*Upcoming ICOs:* ' + upcico +
  '\n*Ongoing ICOs:* ' + ongico +
  '\n*Ended ICOs:* ' + endico +
  '\n*Markets:* ' + mkts +
  '\n*Total Market Cap:* $' + tmcap +
  '\n*Total Volume (24h):* $' + tvol +
  '\n*Bitcoin Dominance:* ' + btcdom + '%', parse_mode: 'Markdown'});
});
}

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
    bot.sendAnimation(msg.chat.id, coverDefi, { caption: '*Global Market Data - DeFi:*' +
    '\n*DeFi Market Cap:* ' + defimcap +
    '\n*ETH Market Cap:* ' + ethmcap +
    '\n*DeFi to ETH:* ' + defieth + '%' +
    '\n*DeFi Volume (24h):* ' + defivol +
    '\n*DeFi Dominance:* ' + defidom + '%' +
    '\n*Top DeFi Coin:* $' + defitop +
    '\n*Top DeFi Dominance:* $' + defitopdom + '%', parse_mode: 'Markdown'});
  });
}

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
bot.sendAnimation(msg.chat.id, coverHot, { caption: "[Top-7 Trending Coins on CoinGecko (24h):](" + geckoHOT + ")\n" + entry.join('\n'), parse_mode: 'Markdown'});

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
            bot.sendChatAction(msg.chat.id, 'typing');
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
                    yval[i] = priceobj[i][1].toFixed(2);
                    mval[i] = mcapobj[i][1].toFixed(2);
                    vval[i] = volobj[i][1].toFixed(2);
                  }

                  xval = xval.filter(function () { return true });
                  for (var i = 0; i < xval.length; i++) {
                    tval[i] = new Date(xval[i]).toLocaleTimeString('en-US' , { hour: '2-digit', minute: '2-digit' });
                    dval[i] = new Date(xval[i]).toLocaleDateString('en-GB' , { month: 'numeric', day: 'numeric' });
                    if (xHrs && !xHrsDays && !xDays) {
                      tdval[i] = tval[i];
                    } else if (!xHrs && xHrsDays && !xDays){
                      tdval[i] = dval[i] + ': ' + tval[i];
                    } else if (!xHrs && !xHrsDays && xDays) {
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
                           order: 0,
                         },{
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
                                      nmaval[i] = (priceobj[i][2] + priceobj[i][3] + priceobj[i][4]) / 3;
                                    }
                                    if (i - Math.round((priceobj.length - 1) * fmamp) >= 0) {
                                      pmaval[i] = (priceobj[i - Math.round((priceobj.length - 1) * fmamp)][2] + priceobj[i - Math.round((priceobj.length - 1) * fmamp)][3] + priceobj[i - Math.round((priceobj.length - 1) * fmamp)][4]) / 3;
                                    } else {
                                      pmaval[i] = (priceobj[i][2] + priceobj[i][3] + priceobj[i][4]) / 3;
                                    }

                                      //BOLLINGER BANDS
                                      typprice[i] = (priceobj[i][2] + priceobj[i][3] + priceobj[i][4]) / 3;
                                      stddevval[i] = math.std(priceobj[i][2], priceobj[i][3], priceobj[i][4]);
                                      bolu[i] = typprice[i] + 2 * stddevval[i];
                                      bolb[i] = typprice[i] - 2* stddevval[i];

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
                                           label: ' Price: $' + Number(closeval[closeval.length - 1]).toLocaleString('en-US', {
                                           notation: 'compact',
                                           compactDisplay: 'short',
                                         }) + "     ",
                                           data: closeval,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           stepped: true,
                                           borderWidth: 2,
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           fill: false,
                                           showLine: true,
                                           borderColor: 'rgba(0, 0, 200, 0.5)',
                                           backgroundColor: 'rgba(0, 0, 200, 0.1)',
                                           yAxisID: 'y-axis-1',
                                           tension: 1,
                                         },{
                                           id: 'maslow',
                                           label: ' MA: SLOW ',
                                           type: 'line',
                                           data: nmaval,
                                           pointRadius: 0,
                                           pointStyle: 'line',
                                           borderWidth: 2,
                                           fill: false,
                                           borderDash: [4,4],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(200, 0, 200, 1)',
                                           backgroundColor: 'rgba(200, 0, 200, 0.1)',

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
                                           borderDash: [4,4],
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(0, 150, 150, 1)',
                                           backgroundColor: 'rgba(0, 150, 150, 0.1)',
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
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(200, 0, 0, 0)',
                                           backgroundColor: 'rgba(0, 0, 0, 0.1)',

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
                                           borderJoinStyle: 'round',
                                           borderCapStyle: 'cap',
                                           borderColor: 'rgba(0, 200, 0, 0)',
                                           backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                           yAxisID: 'y-axis-1',
                                           tension: 10,

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
                                             beginAtZero: false,
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
                                                 })
                                               }},
                                             id: 'y-axis-1',
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
                                          bounds: 'ticks',
                                          type: 'category',
                                          position: 'right',
                                          padding: 5,
                                          beginAtZero: false,
                                          display: false,
                                          grid: {
                                           offset: true,
                                         },
                                          gridLines: {
                                           offset: true,
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


                      // //CANDLECHART COMING WHEN https://github.com/chartjs/chartjs-chart-financial IS RELEASED


  });
