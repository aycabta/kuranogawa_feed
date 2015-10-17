var request = require('request');
var Iconv = require('iconv').Iconv;
var cheerio = require('cheerio');
var RSS = require('rss');

var feed = null;

request({
    uri: 'http://p.eagate.573.jp/game/bemani/hinabita/p/kuranogawa/',
    encoding: null
}, function (error, response, body) {
    var iconv = new Iconv('Shift_JIS', 'UTF-8//TRANSLIT//IGNORE');
    body = iconv.convert(body).toString();
    var $ = cheerio.load(body);
    var author = 'タウンマネージャー 久領堤 纒';
    feed = new RSS({
        title: $(this).find('titrle').text(),
        feed_url: 'http://kuranogawa-feed.chijin-dokku.tk',
        site_url: 'http://p.eagate.573.jp/game/bemani/hinabita/p/kuranogawa/',
        author: author
    });
    $('ul#blog_list li').each(function(i, elem) {
        feed.item({
            title: $(this).find('div.blog_title div').text(),
            description: $(this).find('div.blog_text').text().substring(0, 400),
            url: 'http://p.eagate.573.jp/game/bemani/hinabita/p/kuranogawa/',
            author: author,
            date: $(this).find('div.blog_date').text()
        });
    });
    var xml = feed.xml();
    console.log(xml);
});

