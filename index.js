const request = require('request');
const cheerio = require('cheerio');
const open = require('open');
const config = require('./config.json');
const beeper = require('beeper');

const { urls, timer, price, beepTimes, openBrowser, openBroswerTabsLimit } = config;

urls.forEach(url => {
    setInterval(() => {
        request({
            url,
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            }
        }, async (err, res, html) => {
            if (!err && res.statusCode === 200) {
                const $ = cheerio.load(html);
                const resultUrls = [];

                $('.fixed.offers.breakword.redesigned tr.wrap').each((i, element) => {
                    const currentPrice = parseInt($(element).find('.price strong').text().replace(' ', ''));

                    if (currentPrice <= price) {
                        const link = $(element)
                            .find('.linkWithHash.detailsLink')
                            .attr('href');

                        resultUrls.push(link);
                    }
                });

                if (resultUrls.length) {
                    await beeper(beepTimes);
                    if (openBrowser) {
                        resultUrls
                            .slice(0, openBroswerTabsLimit)
                            .forEach(async url => {
                                await open(url);
                            });
                    }

                    console.log('Some products have been found!');
                }
            }
        });
    }, timer * 1000);
});
