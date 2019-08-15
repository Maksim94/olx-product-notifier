const request = require('request');
const cheerio = require('cheerio');
const open = require('open');
const config = require('./config.json');
const beeper = require('beeper');

const { urls, timer, price, beepTimes, openBrowser } = config;

urls.forEach(url => {
    setInterval(() => {
        request({
            url,
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            }
        }, (err, res, html) => {
            if (!err && res.statusCode === 200) {
                const $ = cheerio.load(html);
                $('.fixed.offers.breakword.redesigned tr.wrap').each(async (i, element) => {
                    const currentPrice = parseInt($(element).find('.price strong').text().replace(' ', ''));

                    if (currentPrice <= price) {
                        console.log('HERE it is', currentPrice);
                        const url = $(element).find('.linkWithHash.detailsLink').attr('href');
                        await beeper(beepTimes);

                        if (openBrowser) {
                            await open(url);
                        }
                    }
                })
            }
        });
    }, timer * 1000);
});
