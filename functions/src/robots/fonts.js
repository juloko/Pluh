const cheerio = require('cheerio');

module.exports = function fonts(data) {
    let news = [];
    let imgNews = [];
    let $ = cheerio.load(data);


    class Fonts {

        bbc() {
            $('p').each(function () {
                news.push($(this).text());
            });

            $('img').each(function () {
                imgNews.push({ 'src': $(this).attr('src'), 'alt': $(this).attr('alt') })
            });

            return { news, imgNews }
        }

        cnn() {

        }

        g1() {

        }

        uol() {

        }
    }

    return new Fonts(data);
};




