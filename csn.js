var Promise = require('bluebird');
var rp = require('request-promise');
var cheerio = require('cheerio');
var _0x77e0=["\x55","\x57","\x4A","\x48","\x44","\x47","\x4D","\x41","\x59","\x49","\x58","\x4E","\x52","\x4C","\x42","\x50","\x4B","\x30","\x31","\x32","\x33","\x34","\x35","\x36","\x37","\x38","\x39","\x63","\x75","\x66","\x72","\x6C\x65\x6E\x67\x74\x68","\x67","\x72\x65\x70\x6C\x61\x63\x65"];function decode_download_url(_0x3f16x2,_0x3f16x3,_0x3f16x4,_0x3f16x5){var _0x3f16x6=[_0x77e0[0],_0x77e0[1],_0x77e0[2],_0x77e0[3],_0x77e0[4],_0x77e0[5],_0x77e0[6],_0x77e0[7],_0x77e0[8],_0x77e0[9],_0x77e0[10],_0x77e0[11],_0x77e0[12],_0x77e0[13],_0x77e0[14],_0x77e0[15],_0x77e0[16]];var _0x3f16x7=[_0x77e0[17],_0x77e0[18],_0x77e0[19],_0x77e0[20],_0x77e0[21],_0x77e0[22],_0x77e0[23],_0x77e0[24],_0x77e0[25],_0x77e0[26],_0x77e0[27],_0x77e0[28],_0x77e0[29],_0x77e0[30],_0x77e0[18],_0x77e0[18],_0x77e0[19]];if(_0x3f16x5> 0){for(var _0x3f16x8=0;_0x3f16x8< _0x3f16x6[_0x77e0[31]];_0x3f16x8++){re=  new RegExp(_0x3f16x6[_0x3f16x8],_0x77e0[32]);_0x3f16x3= _0x3f16x3[_0x77e0[33]](re,_0x3f16x7[_0x3f16x8])}};return (_0x3f16x2+ _0x3f16x3+ _0x3f16x4)}

var getLink = $ => (i, a) => {
    var song = $(a).attr('href');
    console.log('Scraping [%s]...', song);
    return rp(song)
        .then(html => {
            var found = html.match(/decode_download_url\([^\)]+\)/g);
            if (found) {
                var link = eval(found[0]).replace(/\/(32|128)\//, '/320/').replace('.m4a', '.mp3');
                console.log('>>> %s', link);
                return link;
            }
            console.log('Unexpected HTML: %s', found);
            return null;
        })
        .catch(err => console.error(err));
};

module.exports = function(session) {
    var url = cheerio.load(session.message.text);
    rp({ uri: url.text(), transform: html => cheerio.load(html) })
    .then($ => {
        Promise.all($('.playlist_prv .tbtable tr a.musictitle').map(getLink($)).get())
            .then(result => session.send('```' + result.filter(u => u != undefined).join("\n") + '```'))
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};
