const request = require('request');
const cheerio = require('cheerio');
const { createAudio } = require('node-mp3-player');

const Audio = createAudio();

setInterval(() => {
    request({
        url: 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/arenda-kvartir-komnat/kiev/?search%5Bfilter_float_price%3Afrom%5D=5000&search%5Bfilter_float_price%3Ato%5D=9000&search%5Border%5D=created_at%3Adesc',
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        }
    }, async (err, res, html) => {
        if (!err && res.statusCode === 200) {
            const myFile = await Audio(`${__dirname}/sound.mp3`)
            const $ = cheerio.load(html);
            $('.fixed.offers.breakword.redesigned tr.wrap').each((i, element) => {
                const description =  $(element).find('.linkWithHash.detailsLink strong').text();
                const price = $(element).find('.price strong').text();
                const time = $(element).find('.breadcrumb.x-normal span').eq(1).text().trim();
                console.dir(`Description: ${description}, Price: ${price}, Time: ${time}`);
            })
            // console.log('Selling $ prise is: ', $('.indicators__ticker__val2').eq(0).text());
            // console.log('Buying $ prise is: ', $('.indicators__ticker__val1').eq(0).text());
        }
        await myFile.play();
    });
}, 10000);
