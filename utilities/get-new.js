const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// Spotlight Sale
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.xbox.com/en-US/games/xbox-one?cat=newreleases', {
    waitUntil: 'networkidle0',
    timeout: 300000
  });

  let content = await page.content();
  var $ = cheerio.load(content);
  var parsedResults = [];

  $('.gameDivLink').each(function(i, element) {
    var a = $(this);
    var url = a.attr('href');
    var title = a.children('div').children('.c-heading').text();
    var cover = a.children('picture').children('.c-image').attr('src');
    var newprice = a.children('div').children('.c-price').children('.textpricenew').text();
      newprice = newprice.replace(/[^\d.]/g,'');
    var oriprice = a.children('div').children('.c-price').children('s').text();
      oriprice = oriprice.replace(/[^\d.]/g,'');
    var discount = Math.round((oriprice - newprice) * 100 / oriprice) + '% OFF';
    if (!isNaN(newprice) || !isNaN(oriprice)) {
      discount = 'New';
    };
    
    var metadata = {
      url: url,
      title: title,
      cover: cover,
      newprice: newprice,
      oriprice: oriprice,
      discount: discount
    };
    parsedResults.push(metadata);
  });

  let data = JSON.stringify(parsedResults);
  fs.writeFileSync('./data/newreleases.json', data, (err) => {  
    if (err) throw err;
  });

  browser.close();
  console.log("DONE");
}

run();