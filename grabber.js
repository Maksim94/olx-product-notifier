const request = require('request');
const cheerio = require('cheerio');
const config = require('./config.json');
// const { createAudio } = require('node-mp3-player');

// const Audio = createAudio();
const { urls, timer, price } = config;

urls.forEach(url => {
    setInterval(() => {
        request({
            url,
            headers: {
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            }
        }, (err, res, html) => {
            if (!err && res.statusCode === 200) {
                // const myFile = await Audio(`${__dirname}/sound.mp3`)
                const $ = cheerio.load(html);
                $('.fixed.offers.breakword.redesigned tr.wrap').each((i, element) => {
                    const currentPrice = $(element).find('.price strong').text();
                    if (currentPrice <= price) {
                        // const description =  $(element).find('.linkWithHash.detailsLink strong').text();
                        // const time = $(element).find('.breadcrumb.x-normal span').eq(1).text().trim();
                        const url = $(element).find('.linkWithHash.detailsLink').attr('href');
                        // console.dir(`Description: ${description}, Price: ${price}, Time: ${time}`);
                    }
                })
                // console.log('Selling $ prise is: ', $('.indicators__ticker__val2').eq(0).text());
                // console.log('Buying $ prise is: ', $('.indicators__ticker__val1').eq(0).text());
            }
            // await myFile.play();
        });
    }, timer * 1000);
});
