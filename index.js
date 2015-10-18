import request from 'request';
import iconv from 'iconv';
import cheerio from 'cheerio';
import RSS from 'rss';
import express from 'express';

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, resp) {
    request({
        uri: 'http://p.eagate.573.jp/game/bemani/hinabita/p/kuranogawa/',
        encoding: null
    }, function (error, reqResp, body) {
        var ic = new iconv.Iconv('Shift_JIS', 'UTF-8//TRANSLIT//IGNORE');
        body = ic.convert(body).toString();
        var $ = cheerio.load(body);
        var author = 'タウンマネージャー 久領堤 纒';
        var feed = new RSS({
            title: $('title').text(),
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
        resp.send(feed.xml());
    });
}.bind(this));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

