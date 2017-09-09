const request = require('request').defaults({
    jar: true,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.10 Safari/537.36',
        'referer': 'https://www.fshare.vn/login'
    }
});
const cheerio = require('cheerio');

var getLink = (file, session) => {
    console.log('Generating %s ...', file);
    request.get(file, { followRedirect: false }, (error, response, body) => {
        if (response.statusCode == 200) {
            session.send('Đang login nha... ');
            return request.get('https://www.fshare.vn/login', (error, response, body) => {
                var $ = cheerio.load(body);
                var csrf = $($('input[name=fs_csrf]')[0]).attr('value');
                console.log('CSRF: %s', csrf);
                return request.post('https://www.fshare.vn/login', {
                    form: {
                        fs_csrf: csrf,
                        'LoginForm[email]': process.env.FSHARE_EMAIL,
                        'LoginForm[password]': process.env.FSHARE_PASSWORD,
                        'LoginForm[rememberMe]': 1
                    }
                }, (e, r, b) => {
                    if (e) session.send(e.toString());
                    session.send('Login xong rùi, giờ lấy file nè...');
                    request.get(file, { followRedirect: false }, (e, r, b) => {
                        if (e) session.send(e.toString());
                        return extract(r, session);
                    });
                });
            });
        } else {
            return extract(response, session);
        }
    });
};

var extract = (resp, session) => {
    if (resp.statusCode == 302) {
        console.log(resp.headers['location']);
        session.send(`
Lấy đi nè đồ quỷ:
<pre>${resp.headers['location']}</pre>
`);
    } else {
        session.send('Sao hông login được vậy nè chời');
    }
};

module.exports = exports = function(session) {
    var url = cheerio.load(session.message.text.replace(/@?iBot/gi, '').trim());
    getLink(url.text(), session);
};
