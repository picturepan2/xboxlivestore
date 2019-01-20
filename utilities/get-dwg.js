const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// Deals with Gold
async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.microsoft.com/en-us/p/xbox-live-gold/cfq7ttc0k5dj', {
    waitUntil: 'networkidle0',
    timeout: 300000
  });

  let content = await page.content();
  var $ = cheerio.load(content);
  var parsedResults = [];

  $('.m-channel-placement-item').each(function(i, element) {
    var a = $(this).children('a');
    var url = 'https://www.microsoft.com' + a.attr('href');
    var title = a.children('.c-channel-placement-content').children('.c-subheading-6').text();
    var cover = a.children('.c-channel-placement-image').children('picture').children('source').attr('data-srcset');
    var newprice = a.children('.c-channel-placement-content').children('.c-channel-placement-price').children('.c-price').children('span').children('span[itemprop="price"]').text();
      newprice = newprice.replace('$', '');
    var oriprice = a.children('.c-channel-placement-content').children('.c-channel-placement-price').children('.c-price').children('span').children('s').text();
      oriprice = oriprice.replace('$', '');
    var discount = Math.round((oriprice - newprice) * 100 / oriprice) + '% OFF';
    if (oriprice == '') {
      return true;
    }
    
    var metadata = {
      url: url,
      title: title,
      cover: cover,
      newprice: newprice,
      oriprice: oriprice,
      discount: discount
    };
    console.log(metadata);
    parsedResults.push(metadata);
  });

    let data = JSON.stringify(parsedResults);
    fs.writeFileSync('./data/dwg.json', data, (err) => {  
      if (err) throw err;
    });

  browser.close();
  console.log("DONE");
}

run();